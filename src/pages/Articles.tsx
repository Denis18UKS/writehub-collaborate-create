
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleCard from '@/components/article/ArticleCard';

const Articles = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock articles data
  const articles = [
    {
      id: '1',
      title: 'Как начать писать статьи и не бояться',
      excerpt: 'Советы для начинающих авторов, которые помогут преодолеть страх перед чистым листом и начать писать увлекательные и информативные статьи.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '10 мая 2023',
      status: 'published' as const,
      collaborators: 2
    },
    {
      id: '2',
      title: 'Структура статьи: от заголовка до заключения',
      excerpt: 'Разбираемся, как правильно структурировать статьи, чтобы они были понятны и интересны читателю. Анализируем основные элементы структуры.',
      coverImage: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '2 июня 2023',
      status: 'draft' as const,
      collaborators: 1
    },
    {
      id: '3',
      title: 'Искусство заголовка: как привлечь внимание читателя',
      excerpt: 'Практические советы по созданию заголовков, которые привлекут внимание целевой аудитории и увеличат количество прочтений вашей статьи.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '15 июня 2023',
      status: 'scheduled' as const
    },
    {
      id: '4',
      title: 'Редактирование текста: как сделать статью лучше',
      excerpt: 'Процесс редактирования — это не просто исправление ошибок. Узнайте, как улучшить текст и сделать его более качественным и читабельным.',
      coverImage: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      createdAt: '3 июля 2023',
      status: 'published' as const
    },
    {
      id: '5',
      title: 'SEO для авторов: как сделать статью заметной в поиске',
      excerpt: 'Основные принципы оптимизации контента для поисковых систем, которые должен знать каждый автор.',
      createdAt: '20 июля 2023',
      status: 'draft' as const
    }
  ];

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

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="published">Опубликованные</TabsTrigger>
          <TabsTrigger value="draft">Черновики</TabsTrigger>
          <TabsTrigger value="scheduled">Запланированные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterArticles('all').map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterArticles('published').map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterArticles('draft').map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterArticles('scheduled').map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Articles;
