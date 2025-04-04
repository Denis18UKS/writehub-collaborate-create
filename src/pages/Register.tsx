import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
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

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        navigate('/login', { state: { message: 'Регистрация успешна! Теперь вы можете войти.' } });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Произошла ошибка при регистрации');
      } else {
        setError('Сервер недоступен. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Присоединяйтесь к нам"
      description="Создайте аккаунт и станьте частью сообщества авторов"
      footer={
        <p className="text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-accent-purple hover:text-accent-purple/80 font-medium hover:underline transition-colors">
            Войти
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
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Введите имя пользователя"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@mail.com"
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
            placeholder="Минимум 6 символов"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-accent-purple hover:bg-accent-purple/90"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
