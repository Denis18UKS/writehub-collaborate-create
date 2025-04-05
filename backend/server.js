require('dotenv').config(); // Подключаем dotenv

// === 📦 Импорты ===
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');  // Для генерации JWT токена

const path = require('path'); // если ещё не добавлено
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080', // порт фронтенда
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Пользователь подключен');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', ({ message, room }) => {
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключен');
  });
});

// === 🔌 Подключение к MySQL ===
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'writehub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// === Роуты для регистрации и логина ===


// Роут для регистрации
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const connection = await pool.getConnection();

    // Проверка на существующего пользователя
    const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка нового пользователя
    await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    connection.release();
    return res.status(201).json({ message: 'Регистрация успешна' });

  } catch (err) {
    console.error('❌ Ошибка при регистрации:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// Роут для логина
app.post('/api/auth/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    // Проверяем, существует ли пользователь
    const [user] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [login, login]);
    if (user.length === 0 || user[0].password !== password) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    // Генерация токена (например, JWT) и отправка в ответ
    const token = generateAuthToken(user[0].id); // создаём токен с user_id
    res.status(200).json({
      message: 'Авторизация успешна',
      token,
      user_id: user[0].id,  // Отправляем user_id в ответе
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при авторизации' });
  }
});


// === Редактирование профиля ===
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId из токена
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};


app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [user] = await connection.execute(
      'SELECT username, email, full_name, bio, profile_image, vk_id, telegram_id FROM users WHERE id = ?',
      [req.user.userId]
    );
    connection.release();

    if (user.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user[0]);
  } catch (err) {
    console.error('❌ Ошибка при получении профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.put('/api/profile', authenticate, async (req, res) => {
  const { full_name, email, bio, website } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE users SET full_name = ?, email = ?, bio = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, email, bio, website, req.user.userId]
    );
    connection.release();

    res.json({ message: 'Профиль успешно обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.post('/api/profile/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [imagePath, req.user.userId]
    );
    connection.release();

    res.json({ imageUrl: imagePath });
  } catch (err) {
    console.error('Ошибка загрузки аватарки:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// === Роуты для статей ===

// 🔹 Создание статьи с поддержкой запланированной публикации
app.post('/api/articles', async (req, res) => {
  const { title, content, excerpt, cover_image, status, owner_id, tags = [], scheduled_publish_time } = req.body;

  if (!title || !content || !owner_id) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const connection = await pool.getConnection();

    // Преобразуем формат даты, если она передана
    let formattedDate = null;
    if (scheduled_publish_time) {
      const date = new Date(scheduled_publish_time);
      formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    // Вставка статьи в таблицу articles
    const [articleResult] = await connection.execute(
      'INSERT INTO articles (title, content, excerpt, cover_image, status, owner_id, scheduled_publish_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        content,
        excerpt ?? null,
        cover_image ?? null,
        status || 'draft',
        owner_id,
        formattedDate
      ]
    );

    const articleId = articleResult.insertId;

    // Связывание тегов с статьей
    if (tags.length > 0) {
      const tagPromises = tags.map(tagId =>
        connection.execute('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId])
      );
      await Promise.all(tagPromises);
    }

    // Вставка первой версии статьи в article_versions
    await connection.execute(
      'INSERT INTO article_versions (article_id, content, modified_by, version_number) VALUES (?, ?, ?, ?)',
      [articleId, content, owner_id, 1]
    );

    connection.release();
    return res.status(201).json({ message: 'Статья успешно создана', articleId });
  } catch (err) {
    console.error('❌ Ошибка при создании статьи:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Получение всех статей
app.get('/api/articles', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [articles] = await connection.execute('SELECT * FROM articles');
    connection.release();
    return res.json(articles);
  } catch (err) {
    console.error('❌ Ошибка при получении статей:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Получение статьи по ID
app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [article] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);

    if (article.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Получаем теги статьи
    const [tags] = await connection.execute('SELECT tag_id FROM article_tags WHERE article_id = ?', [id]);

    connection.release();
    return res.json({ ...article[0], tags });
  } catch (err) {
    console.error('❌ Ошибка при получении статьи:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Обновление статьи
// === 🔄 Функция для проверки и публикации запланированных статей ===
async function publishScheduledArticles() {
  try {
    const connection = await pool.getConnection();

    // Получаем список статей, запланированных на текущий момент или ранее
    const [articles] = await connection.execute(
      'SELECT id FROM articles WHERE status = "scheduled" AND scheduled_publish_time <= NOW()'
    );

    // Публикуем каждую статью
    for (const article of articles) {
      await connection.execute(
        'UPDATE articles SET status = "published" WHERE id = ?',
        [article.id]
      );
      console.log(`🗓️ Опубликована запланированная статья с ID: ${article.id}`);
    }

    connection.release();
  } catch (err) {
    console.error('❌ Ошибка при публикации запланированных статей:', err);
  }
}

// Проверяем и публикуем запланированные статьи каждую минуту
setInterval(publishScheduledArticles, 60000);

// 🔹 Обновление статьи
app.put('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, cover_image, status, tags = [], scheduled_publish_time } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const connection = await pool.getConnection();

    // Преобразуем формат даты, если она передана
    let formattedDate = null;
    if (scheduled_publish_time) {
      const date = new Date(scheduled_publish_time);
      formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    // Обновление статьи
    await connection.execute(
      'UPDATE articles SET title = ?, content = ?, excerpt = ?, cover_image = ?, status = ?, scheduled_publish_time = ? WHERE id = ?',
      [title, content, excerpt, cover_image, status, formattedDate, id]
    );

    // Обновление версий статьи
    const [article] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);
    if (article.length > 0) {
      // Получить последнюю версию статьи
      const [versionResult] = await connection.execute(
        'SELECT MAX(version_number) as max_version FROM article_versions WHERE article_id = ?',
        [id]
      );
      const lastVersion = versionResult[0].max_version || 0;
      const newVersionNumber = lastVersion + 1;

      await connection.execute(
        'INSERT INTO article_versions (article_id, content, modified_by, version_number) VALUES (?, ?, ?, ?)',
        [id, content, article[0].owner_id, newVersionNumber]
      );
    }

    // Обновление тегов статьи
    await connection.execute('DELETE FROM article_tags WHERE article_id = ?', [id]);
    if (tags.length > 0) {
      const tagPromises = tags.map(tagId =>
        connection.execute('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [id, tagId])
      );
      await Promise.all(tagPromises);
    }

    connection.release();
    return res.status(200).json({ message: 'Статья успешно обновлена' });
  } catch (err) {
    console.error('❌ Ошибка при обновлении статьи:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Получение статьи для публичного просмотра по ID
app.get('/shared-article/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [article] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);

    if (article.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Получаем теги статьи
    const [tags] = await connection.execute('SELECT tag_id FROM article_tags WHERE article_id = ?', [id]);

    connection.release();
    return res.json({ ...article[0], tags });
  } catch (err) {
    console.error('❌ Ошибка при получении статьи:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Получение всех тегов
app.get('/api/tags', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tags] = await connection.execute('SELECT id, name FROM tags');
    connection.release();
    return res.json(tags);
  } catch (err) {
    console.error('❌ Ошибка при получении тегов:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});


const { v4: uuidv4 } = require('uuid'); // Добавьте эту зависимость: npm install uuid

// 🔗 Создание ссылки для доступа к статье
// Создание ссылки для доступа к статье
app.post('/api/articles/:id/share', async (req, res) => {
  const { id } = req.params;
  const { permission_level = 'edit', expires_days = 7 } = req.body; // По умолчанию - права на редактирование и 7 дней

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  const token = authHeader.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  try {
    const connection = await pool.getConnection();

    // Проверяем существование статьи
    const [article] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);
    if (article.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Проверяем, что пользователь является владельцем статьи
    if (article[0].owner_id !== userId) {
      connection.release();
      return res.status(403).json({ message: 'У вас нет прав для создания ссылки' });
    }

    // Генерация уникальной ссылки
    const shareId = uuidv4();

    // Расчет даты истечения ссылки
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_days);
    const formattedExpiresAt = expiresAt.toISOString().slice(0, 19).replace('T', ' ');

    await connection.execute(
      'INSERT INTO share_links (id, article_id, created_by, permission_level, expires_at) VALUES (?, ?, ?, ?, ?)',
      [shareId, id, userId, permission_level, formattedExpiresAt]
    );

    connection.release();

    let shareUrl;
    if (permission_level === 'edit') {
      shareUrl = `http://localhost:8080/edit/${id}?share=${shareId}`;
    } else {
      shareUrl = `http://localhost:8080/view/${id}?share=${shareId}`;
    }

    return res.status(201).json({
      shareId,
      shareUrl,
      expiresAt,
      permission_level
    });
  } catch (err) {
    console.error('❌ Ошибка при создании ссылки для доступа:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});


// 🔗 Проверка действительности ссылки для доступа и получение данных статьи
app.get('/api/articles/share/:shareId', async (req, res) => {
  const { shareId } = req.params;

  try {
    const connection = await pool.getConnection();

    // Проверяем существование и действительность ссылки
    const [shareLink] = await connection.execute(
      'SELECT s.*, a.title, a.content, a.owner_id FROM share_links s JOIN articles a ON s.article_id = a.id WHERE s.id = ? AND (s.expires_at IS NULL OR s.expires_at > NOW())',
      [shareId]
    );

    if (shareLink.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Ссылка недействительна или просрочена' });
    }

    // Получаем теги статьи
    const [tags] = await connection.execute(
      'SELECT t.id, t.name FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?',
      [shareLink[0].article_id]
    );

    connection.release();

    // Возвращаем данные в зависимости от уровня доступа
    const articleData = {
      id: shareLink[0].article_id,
      title: shareLink[0].title,
      content: shareLink[0].content,
      owner_id: shareLink[0].owner_id,
      tags: tags.map(tag => ({ id: tag.id, name: tag.name })),
      permission_level: shareLink[0].permission_level,
      expires_at: shareLink[0].expires_at
    };

    return res.status(200).json({
      valid: true,
      article: articleData
    });
  } catch (err) {
    console.error('❌ Ошибка при проверке ссылки для доступа:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// 🔹 Обновление статьи через ссылку общего доступа
app.put('/api/articles/:id/shared/:shareId', async (req, res) => {
  const { id, shareId } = req.params;
  const { title, content, tags = [] } = req.body;

  try {
    const connection = await pool.getConnection();

    // Проверяем действительность ссылки и права на редактирование
    const [shareLink] = await connection.execute(
      'SELECT * FROM share_links WHERE id = ? AND article_id = ? AND permission_level = "edit" AND (expires_at IS NULL OR expires_at > NOW())',
      [shareId, id]
    );

    if (shareLink.length === 0) {
      connection.release();
      return res.status(403).json({ message: 'Нет прав на редактирование или срок действия ссылки истек' });
    }

    // Проверяем существование статьи
    const [article] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id]);

    if (article.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Обновляем статью
    await connection.execute(
      'UPDATE articles SET title = ?, content = ?, updated_at = NOW() WHERE id = ?',
      [title, content, id]
    );

    // Увеличиваем номер версии статьи
    const [versionResult] = await connection.execute('SELECT MAX(version_number) as max_version FROM article_versions WHERE article_id = ?', [id]);
    const currentVersion = versionResult[0].max_version || 0;
    const newVersionNumber = currentVersion + 1;

    // Сохраняем новую версию
    await connection.execute(
      'INSERT INTO article_versions (article_id, content, modified_by, version_number) VALUES (?, ?, ?, ?)',
      [id, content, shareLink[0].created_by, newVersionNumber]
    );

    // Обновляем теги статьи
    await connection.execute('DELETE FROM article_tags WHERE article_id = ?', [id]);
    if (tags.length > 0) {
      const tagPromises = tags.map(tagId =>
        connection.execute('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [id, tagId])
      );
      await Promise.all(tagPromises);
    }

    connection.release();
    return res.status(200).json({ message: 'Статья успешно обновлена' });
  } catch (err) {
    console.error('❌ Ошибка при обновлении статьи по ссылке общего доступа:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});


// === Маршрут для получения идей ===
app.get('/ideas', async (req, res) => {
  try {
    const [ideas] = await pool.query(`
      SELECT i.*, 
             COALESCE(SUM(CASE WHEN iv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) AS votes
      FROM ideas i
      LEFT JOIN idea_votes iv ON i.id = iv.idea_id
      WHERE i.status = "open"
      GROUP BY i.id
      ORDER BY votes DESC
    `);
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении идей' });
  }
});


// === Маршрут для добавления новой идеи ===
app.post('/ideas', async (req, res) => {
  const { title, description, user_id } = req.body;

  if (!title || !description || !user_id) {
    return res.status(400).json({ message: 'Заголовок, описание и пользователь обязательны' });
  }

  try {
    // Проверяем, существует ли пользователь с user_id
    const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [user_id]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Вставка новой идеи
    const [result] = await pool.query(
      'INSERT INTO ideas (title, description, user_id, status) VALUES (?, ?, ?, "open")',
      [title, description, user_id]
    );
    
    res.status(201).json({ message: 'Идея успешно добавлена', ideaId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при добавлении идеи' });
  }
});


// === 🚀 Запуск сервера ===
const PORT = process.env.PORT || 5000;
server.listen(5000, () => {
  console.log('🚀 Сервер запущен на http://localhost:5000');
});