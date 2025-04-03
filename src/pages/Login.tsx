
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/layout/AuthLayout';

const Login = () => {
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
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
