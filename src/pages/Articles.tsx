import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleCard from '@/components/article/ArticleCard';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover_image?: string;
  created_at: string;
  status: 'draft' | 'published' | 'scheduled';
  collaborators?: number; // пока не приходит с бэка, можно оставить как заглушку
}

const Articles = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const ownerId = localStorage.getItem('user_id');
      if (!ownerId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/articles?ownerId=${ownerId}`);
        const data = await res.json();
        const formatted = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || '',
          cover_image: a.cover_image,
          created_at: new Date(a.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          status: a.status,
          collaborators: 0,
        }));
        setArticles(formatted);
      } catch (err) {
        console.error('Ошибка при загрузке статей:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);


  const filterArticles = (status: string) => {
    if (status === 'all') return articles;
    return articles.filter(article => article.status === status);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мои статьи</h1>
        <Button className="bg-gradient-to-r from-accent-purple to-accent-cream text-white" asChild>
          <Link to="/dashboard/articles/new">Создать статью</Link>
        </Button>
      </div>

      {loading ? (
        <p>Загрузка статей...</p>
      ) : (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="published">Опубликованные</TabsTrigger>
            <TabsTrigger value="draft">Черновики</TabsTrigger>
            <TabsTrigger value="scheduled">Запланированные</TabsTrigger>
          </TabsList>

          {['all', 'published', 'draft', 'scheduled'].map(tab => (
            <TabsContent value={tab} key={tab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterArticles(tab).map(article => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    coverImage={article.cover_image}
                    createdAt={article.created_at}
                    status={article.status}
                    collaborators={article.collaborators}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default Articles;
