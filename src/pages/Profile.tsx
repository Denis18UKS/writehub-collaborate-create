import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать не менее 2 символов' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  bio: z.string().optional(),
  website: z.string().url({ message: 'Введите корректный URL' }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
const [avatar, setAvatar] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      website: '',
    },
  });

  const token = localStorage.getItem('token'); // предполагаем, что токен сохранён сюда

  // Загрузка текущего профиля
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Ошибка загрузки профиля');

        const data = await res.json();
        form.reset({
          name: data.full_name || '',
          email: data.email || '',
          bio: data.bio || '',
          website: data.profile_image || '',
        });
      } catch (err) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить профиль' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form, token, toast]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: values.name,
          email: values.email,
          bio: values.bio,
          website: values.website,
        }),
      });

      if (!res.ok) throw new Error('Ошибка обновления');

      toast({
        title: 'Профиль обновлён',
        description: 'Ваши данные успешно сохранены.',
      });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль.',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Персональная информация</CardTitle>
                <CardDescription>Обновите ваши персональные данные</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Полное имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Петров" {...field} />
                            </FormControl>
                            <FormDescription>
                              Это имя будет отображаться в профиле и на ваших публикациях.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Эта почта используется для входа и уведомлений.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>О себе</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Расскажите немного о себе..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Краткая информация о вас, ваших интересах и опыте.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Веб-сайт</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-website.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Ваш личный сайт или профиль в социальной сети.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-accent-purple to-accent-cream text-white"
                    >
                      Сохранить изменения
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
