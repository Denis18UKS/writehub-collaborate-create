require('dotenv').config(); // Подключаем dotenv

// === 📦 Импорты ===
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');  // Для генерации JWT токена

const app = express();
app.use(cors());
app.use(express.json());

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
  const { login, password } = req.body; // теперь принимаем login

  if (!login || !password) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const connection = await pool.getConnection();

    // Проверка, существует ли пользователь с таким email или username
    const [user] = await connection.execute('SELECT * FROM users WHERE email = ? OR username = ?', [login, login]);
    if (user.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Сравнение пароля с хешированным
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      connection.release();
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    connection.release();

    // Генерация JWT токена
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ message: 'Авторизация успешна', token });

  } catch (err) {
    console.error('❌ Ошибка при авторизации:', err);
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// === 🚀 Запуск сервера ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
