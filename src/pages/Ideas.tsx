
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';

const Ideas = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) {
      toast({
        title: "Заголовок обязателен",
        description: "Пожалуйста, добавьте заголовок для вашей идеи.",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    toast({
      title: "Идея добавлена",
      description: "Ваша идея успешно опубликована в сообществе."
    });
    
    // Reset form and close dialog
    setIdeaTitle('');
    setIdeaDescription('');
    setIsDialogOpen(false);
  };

  // Mock ideas data
  const ideas = [
    {
      id: '1',
      title: 'Добавить функцию совместного редактирования в режиме реального времени',
      description: 'Было бы здорово, если бы несколько авторов могли одновременно редактировать статью и видеть изменения друг друга в режиме реального времени.',
      author: 'Алексей Петров',
      votes: 42,
      comments: 8,
      date: '2 дня назад',
      tags: ['функционал', 'совместная работа']
    },
    {
      id: '2',
      title: 'Интеграция с социальными сетями для более легкой публикации',
      description: 'Предлагаю добавить возможность публиковать статьи напрямую в социальные сети из редактора WriteHub.',
      author: 'Мария Иванова',
      votes: 38,
      comments: 5,
      date: '5 дней назад',
      tags: ['интеграции', 'соцсети']
    },
    {
      id: '3',
      title: 'Статистика чтения для авторов',
      description: 'Добавить более подробную статистику для авторов: время чтения статьи, процент пользователей, дочитавших до конца, тепловая карта внимания.',
      author: 'Дмитрий Сидоров',
      votes: 27,
      comments: 12,
      date: '1 неделя назад',
      tags: ['аналитика', 'статистика']
    },
    {
      id: '4',
      title: 'Шаблоны для различных типов статей',
      description: 'Предлагаю добавить набор шаблонов для разных типов контента: исследования, обзоры, инструкции, истории и т.д.',
      author: 'Екатерина Смирнова',
      votes: 24,
      comments: 3,
      date: '1 неделя назад',
      tags: ['шаблоны', 'редактор']
    },
    {
      id: '5',
      title: 'Встроенная система комментариев для читателей',
      description: 'Хотелось бы иметь встроенную систему комментариев, где читатели могут обсуждать материалы, а авторы - отвечать на вопросы.',
      author: 'Игорь Козлов',
      votes: 19,
      comments: 7,
      date: '2 недели назад',
      tags: ['коммуникация', 'комментарии']
    },
  ];

  const filterIdeas = (filter: string) => {
    switch (filter) {
      case 'new':
        return [...ideas].sort((a, b) => (a.date < b.date ? 1 : -1));
      case 'hot':
        return [...ideas].filter(idea => idea.votes > 30);
      case 'popular':
      default:
        return [...ideas].sort((a, b) => (a.votes < b.votes ? 1 : -1));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Предложения и идеи</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-accent-purple to-accent-cream text-white">
              Предложить идею
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Предложить новую идею</DialogTitle>
              <DialogDescription>
                Поделитесь своими мыслями о том, как улучшить WriteHub. Лучшие идеи будут реализованы!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitIdea}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="idea-title" className="text-sm font-medium">
                    Заголовок идеи
                  </label>
                  <Input
                    id="idea-title"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    placeholder="Краткое описание вашей идеи"
                    className="col-span-3"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="idea-description" className="text-sm font-medium">
                    Описание
                  </label>
                  <Textarea
                    id="idea-description"
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    placeholder="Подробно опишите вашу идею и почему она будет полезна"
                    className="col-span-3 min-h-[150px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Отправить идею</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-gray-600 mb-6">
        Это место, где сообщество может предлагать новые идеи для улучшения платформы, обсуждать их и голосовать за лучшие предложения.
      </p>

      <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="popular">Популярные</TabsTrigger>
          <TabsTrigger value="new">Новые</TabsTrigger>
          <TabsTrigger value="hot">Горячие</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular" className="mt-6 space-y-6">
          {filterIdeas('popular').map(idea => (
            <Card key={idea.id} className="bg-white">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{idea.title}</CardTitle>
                  <div className="flex flex-col items-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg">{idea.votes}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{idea.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <span>{idea.author} • {idea.date}</span>
                <Button variant="ghost" size="sm" className="h-8">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {idea.comments} комментариев
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="new" className="mt-6 space-y-6">
          {filterIdeas('new').map(idea => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{idea.title}</CardTitle>
                  <div className="flex flex-col items-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg">{idea.votes}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{idea.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <span>{idea.author} • {idea.date}</span>
                <Button variant="ghost" size="sm" className="h-8">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {idea.comments} комментариев
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="hot" className="mt-6 space-y-6">
          {filterIdeas('hot').map(idea => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{idea.title}</CardTitle>
                  <div className="flex flex-col items-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg">{idea.votes}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{idea.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <span>{idea.author} • {idea.date}</span>
                <Button variant="ghost" size="sm" className="h-8">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {idea.comments} комментариев
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Ideas;
