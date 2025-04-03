
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-purple to-accent-cream bg-clip-text text-transparent">
            Добро пожаловать в WriteHub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Создавайте, редактируйте и публикуйте статьи вместе с единомышленниками. Присоединяйтесь к сообществу авторов и воплощайте свои идеи в жизнь.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-accent-purple to-accent-cream text-white px-8" asChild>
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Что мы предлагаем</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              WriteHub — это инновационная платформа для авторов и читателей, которая объединяет творческих людей в единое сообщество.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-full bg-accent-purple/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Удобный редактор</h3>
              <p className="text-gray-600">
                Интуитивно понятный редактор с расширенными возможностями форматирования и совместного редактирования.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-full bg-accent-purple/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Сообщество авторов</h3>
              <p className="text-gray-600">
                Возможность взаимодействия с другими авторами, обмен опытом и получение обратной связи.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-full bg-accent-purple/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
              <p className="text-gray-600">
                Подробная статистика по вашим публикациям, помогающая понять, что интересует вашу аудиторию.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Простой процесс от регистрации до публикации вашего контента
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-4">Регистрация</h3>
                <p className="text-gray-600 mb-4">
                  Создайте личный аккаунт, чтобы получить доступ ко всем функциям платформы. Регистрация бесплатна и занимает менее минуты.
                </p>
                <Button variant="link" className="text-accent-purple p-0" asChild>
                  <Link to="/register">Зарегистрироваться</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-4">Создание контента</h3>
                <p className="text-gray-600 mb-4">
                  Используйте наш мощный редактор для создания увлекательных статей. Добавляйте форматирование, изображения и медиа-контент для привлечения внимания.
                </p>
                <Button variant="link" className="text-accent-purple p-0" asChild>
                  <Link to="/login">Начать писать</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-4">Сотрудничество</h3>
                <p className="text-gray-600 mb-4">
                  Приглашайте соавторов и редакторов для совместной работы над материалами. Обсуждайте изменения в режиме реального времени через встроенный чат.
                </p>
                <Button variant="link" className="text-accent-purple p-0" asChild>
                  <Link to="/login">Пример совместной работы</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-4">Публикация и аналитика</h3>
                <p className="text-gray-600 mb-4">
                  Публикуйте готовые материалы и отслеживайте их эффективность. Используйте аналитические данные для улучшения будущих публикаций.
                </p>
                <Button variant="link" className="text-accent-purple p-0" asChild>
                  <Link to="/login">Перейти в панель управления</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-accent-purple to-accent-cream text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к нашему сообществу авторов и делитесь своими идеями с миром.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-accent-purple hover:bg-gray-100" asChild>
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
