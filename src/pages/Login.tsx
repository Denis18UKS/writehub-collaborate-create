import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '', // Поле для username или email
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.login || !formData.password) {
      setError('Все поля обязательны');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        login: formData.login, // отправляем login, который может быть как email, так и username
        password: formData.password
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // сохраняем токен
        localStorage.setItem('user_id', response.data.user_id); // сохраняем user_id
        navigate('/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Произошла ошибка при входе');
      } else {
        setError('Сервер недоступен. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Добро пожаловать!"
      description="Введите данные для доступа к вашему аккаунту"
      footer={
        <p className="text-center text-gray-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-accent-purple hover:text-accent-purple/80 font-medium hover:underline transition-colors">
            Зарегистрироваться
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="login">Email или имя пользователя</Label>
          <Input
            id="login"
            name="login"
            type="text"
            value={formData.login}
            onChange={handleChange}
            required
            placeholder="Введите ваш email или имя пользователя"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Введите пароль"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-accent-purple hover:bg-accent-purple/90"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
