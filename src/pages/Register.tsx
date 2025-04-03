
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/layout/AuthLayout';

const Register = () => {
  return (
    <AuthLayout 
      title="Создайте аккаунт" 
      description="Присоединяйтесь к сообществу авторов"
      footer={
        <p className="text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-accent-purple hover:underline">
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
