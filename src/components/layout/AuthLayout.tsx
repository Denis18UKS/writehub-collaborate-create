
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

const AuthLayout = ({ children, title, description, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-accent-purple to-accent-cream p-8 flex-col justify-between">
        <div>
          <Link to="/" className="text-3xl font-bold text-white mb-6 block">
            WriteHub
          </Link>
          <h1 className="text-4xl font-bold text-white mt-20 mb-4">
            Добро пожаловать в сообщество авторов
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Создавайте, редактируйте и публикуйте статьи вместе с единомышленниками.
          </p>
        </div>
        <div className="text-white/70 text-sm">
          © {new Date().getFullYear()} WriteHub. Все права защищены.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          {children}
          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
