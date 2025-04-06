import React, { useState, useEffect } from 'react';
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
  const [ideas, setIdeas] = useState([]);

  const { toast } = useToast();

  // Fetch ideas from the server
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:5000/ideas');
        if (response.ok) {
          const data = await response.json();
          setIdeas(data);
        } else {
          toast({
            title: 'Ошибка',
            description: 'Не удалось загрузить идеи.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Ошибка',
          description: 'Что-то пошло не так. Попробуйте снова позже.',
          variant: 'destructive'
        });
      }
    };

    fetchIdeas();
  }, [toast]);

  // Handle idea submission
  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) {
      toast({
        title: "Заголовок обязателен",
        description: "Пожалуйста, добавьте заголовок для вашей идеи.",
        variant: "destructive"
      });
      return;
    }

    const userId = localStorage.getItem('user_id'); // Получаем user_id из localStorage
    if (!userId) {
      toast({
        title: "Ошибка",
        description: "Пользователь не найден. Пожалуйста, войдите в систему.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Отправляем токен в заголовке
        },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaDescription,
          user_id: userId,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Идея добавлена',
          description: 'Ваша идея успешно опубликована.',
        });
        setIdeaTitle('');
        setIdeaDescription('');
        setIsDialogOpen(false);
        // Optionally refetch ideas
        setIdeas(prevIdeas => [
          ...prevIdeas,
          {
            id: data.ideaId,
            title: ideaTitle,
            description: ideaDescription,
            author: 'Текущий пользователь', // Можно добавить реальное имя пользователя
            votes: 0,
            comments: 0,
            date: 'Только что',
            tags: [],
          },
        ]);
      } else {
        toast({
          title: 'Ошибка',
          description: data.message || 'Не удалось добавить идею.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить идею.',
        variant: 'destructive'
      });
    }
  };

  const filterIdeas = (filter: string) => {
    switch (filter) {
      case 'new':
        return [...ideas].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
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
          {filterIdeas('popular')?.map(idea => ( // Используем optional chaining
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
                  {idea.tags?.map((tag, index) => ( // Дополнительная проверка для tags
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


        {/* Similarly for "new" and "hot" tabs */}
      </Tabs>
    </DashboardLayout>
  );
};

export default Ideas;
