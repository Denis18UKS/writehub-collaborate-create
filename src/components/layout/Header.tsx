
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlignJustify, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-cream bg-clip-text text-transparent">
            WriteHub
          </span>
        </Link>

        {!isMobile ? (
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link to="/explore" className="text-gray-600 hover:text-accent-purple transition-colors">
                Обзор
              </Link>
              <Link to="/ideas" className="text-gray-600 hover:text-accent-purple transition-colors">
                Идеи
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-accent-purple transition-colors">
                О нас
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Войти</Link>
              </Button>
              <Button className="bg-gradient-to-r from-accent-purple to-accent-cream text-white" asChild>
                <Link to="/register">Зарегистрироваться</Link>
              </Button>
            </div>
          </div>
        ) : (
          <button onClick={toggleMenu} className="p-2 text-gray-600">
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <AlignJustify className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-white z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-6">
            <nav className="flex flex-col items-center gap-6 text-xl">
              <Link to="/explore" className="text-gray-600 hover:text-accent-purple transition-colors" onClick={() => setIsOpen(false)}>
                Обзор
              </Link>
              <Link to="/ideas" className="text-gray-600 hover:text-accent-purple transition-colors" onClick={() => setIsOpen(false)}>
                Идеи
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-accent-purple transition-colors" onClick={() => setIsOpen(false)}>
                О нас
              </Link>
            </nav>
            <div className="flex flex-col w-full gap-3 mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>Войти</Link>
              </Button>
              <Button className="w-full bg-gradient-to-r from-accent-purple to-accent-cream text-white" asChild>
                <Link to="/register" onClick={() => setIsOpen(false)}>Зарегистрироваться</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
