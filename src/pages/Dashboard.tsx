import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, FileText, MessageSquare, Eye } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate(); // Для переходов по страницам

  // Mock data
  const stats = [
    { title: 'Всего статей', value: '12', change: '+2', up: true },
    { title: 'Опубликовано', value: '8', change: '+1', up: true },
    { title: 'Просмотры', value: '1,234', change: '+5%', up: true },
    { title: 'Комментарии', value: '56', change: '-3%', up: false },
  ];

  const recentArticles = [
    { id: '1', title: 'Начало работы с WriteHub', date: '2 дня назад', views: 324, comments: 12 },
    { id: '2', title: 'Искусство написания статей', date: '1 неделя назад', views: 752, comments: 28 },
    { id: '3', title: 'Как привлечь аудиторию', date: '2 недели назад', views: 1204, comments: 46 },
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Добро пожаловать!</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className={`text-sm flex items-center ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Недавние статьи</CardTitle>
            <CardDescription>Ваши последние публикации и их статистика</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => navigate(`/dashboard/articles/${article.id}`)} // Клик по статье ведет на её страницу
                >
                  <div>
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {article.views}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {article.comments}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Часто используемые инструменты</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Создать статью */}
            <Card
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/dashboard/articles/new')}
            >
              <CardContent className="flex flex-col items-center justify-center py-6">
                <FileText className="h-12 w-12 text-accent-purple mb-4" />
                <p className="font-semibold">Создать статью</p>
              </CardContent>
            </Card>

            {/* Предложить идею */}
            <Card
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/dashboard/ideas')}
            >
              <CardContent className="flex flex-col items-center justify-center py-6">
                <MessageSquare className="h-12 w-12 text-accent-purple mb-4" />
                <p className="font-semibold">Предложить идею</p>
              </CardContent>
            </Card>

            {/* Просмотреть статистику */}
            <Card
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/dashboard/stats')}
            >
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Eye className="h-12 w-12 text-accent-purple mb-4" />
                <p className="font-semibold">Просмотреть статистику</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
