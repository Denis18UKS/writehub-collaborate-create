import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
}

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`);
        if (!res.ok) {
          throw new Error('Статья не найдена');
        }
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError('Ошибка загрузки статьи');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSave = async () => {
    if (article) {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (res.ok) {
        navigate(`/dashboard/articles/${id}`);
      } else {
        setError('Ошибка при сохранении статьи');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (article) {
      setArticle({
        ...article,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (loading) return <p>Загрузка статьи...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Редактировать статью</h1>
      {article && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Заголовок</label>
            <input
              type="text"
              name="title"
              value={article.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Контент</label>
            <textarea
              name="content"
              value={article.content}
              onChange={handleChange}
              rows={10}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Краткое описание</label>
            <input
              type="text"
              name="excerpt"
              value={article.excerpt}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Статус</label>
            <select
              name="status"
              value={article.status}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
              <option value="scheduled">Запланировано</option>
            </select>
          </div>

          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-accent-purple to-accent-cream text-white"
          >
            Сохранить изменения
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditArticle;
