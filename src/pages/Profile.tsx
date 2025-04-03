
import React from 'react';
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Иван Петров',
      email: 'ivan@example.com',
      bio: 'Автор статей о технологиях и инновациях. Люблю писать о новых тенденциях в IT-индустрии.',
      website: 'https://example.com',
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>

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

          <Card>
            <CardHeader>
              <CardTitle>Настройки аккаунта</CardTitle>
              <CardDescription>Управление аккаунтом и безопасностью</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Сменить пароль</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block mb-2 text-sm font-medium">
                      Текущий пароль
                    </label>
                    <Input type="password" id="current-password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block mb-2 text-sm font-medium">
                      Новый пароль
                    </label>
                    <Input type="password" id="new-password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">
                      Подтвердите пароль
                    </label>
                    <Input type="password" id="confirm-password" placeholder="••••••••" />
                  </div>
                  <Button variant="outline">Сменить пароль</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Социальные сети</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4C75A3] h-10 w-10 flex items-center justify-center rounded-md text-white">
                        VK
                      </div>
                      <div>
                        <p className="font-medium">ВКонтакте</p>
                        <p className="text-sm text-gray-500">Подключено</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Отключить</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#0088cc] h-10 w-10 flex items-center justify-center rounded-md text-white">
                        TG
                      </div>
                      <div>
                        <p className="font-medium">Telegram</p>
                        <p className="text-sm text-gray-500">Не подключено</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Подключить</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
