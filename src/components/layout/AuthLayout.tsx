
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
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-accent-purple via-accent-purple/80 to-accent-sage p-8 flex-col justify-between">
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-serif font-bold text-white mb-6 block">
            WriteHub
          </Link>
          <h1 className="text-4xl font-serif font-bold text-white mt-20 mb-6 leading-tight">
            Добро пожаловать в сообщество авторов
          </h1>
          <p className="text-white/90 text-lg max-w-md leading-relaxed">
            Создавайте, редактируйте и публикуйте статьи вместе с единомышленниками в уютной и вдохновляющей атмосфере.
          </p>
          
          {/* Decorative elements */}
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent-sage/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="text-white/70 text-sm relative z-10">
          © {new Date().getFullYear()} WriteHub. Все права защищены.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 bg-gradient-to-b from-white to-accent-cream/10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-soft">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-3 text-gradient">{title}</h2>
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
