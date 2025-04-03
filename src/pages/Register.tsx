
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/layout/AuthLayout';

const Register = () => {
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
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
