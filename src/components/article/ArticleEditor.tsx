
import React, { useState } from 'react';
import ArticleHeader from './ArticleHeader';
import { useToast } from '@/hooks/use-toast';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleShare = () => {
    // Generate a unique share link
    const shareLink = `${window.location.origin}/shared-article/${Date.now()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: "Ссылка скопирована",
      description: "Теперь вы можете поделиться статьей с соавторами."
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Публикация запланирована",
      description: "Статья будет опубликована в выбранную дату."
    });
  };

  const handlePublish = () => {
    if (!title) {
      toast({
        title: "Заголовок обязателен",
        description: "Пожалуйста, добавьте заголовок перед публикацией.",
        variant: "destructive"
      });
      return;
    }

    if (!content || content.length < 50) {
      toast({
        title: "Недостаточно контента",
        description: "Пожалуйста, добавьте больше содержания перед публикацией.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Статья опубликована!",
      description: "Ваша статья успешно опубликована и теперь доступна читателям."
    });
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-white p-6 border-b border-gray-200 sticky top-0 z-10">
        <ArticleHeader
          onShare={handleShare}
          onSchedule={handleSchedule}
          onPublish={handlePublish}
        />
      </div>
      
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <input
          type="text"
          placeholder="Заголовок статьи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold border-0 border-b border-transparent focus:border-gray-200 focus:ring-0 px-0 py-2 mb-6 placeholder:text-gray-300"
        />
        
        <textarea
          placeholder="Начните писать свою историю..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[400px] border-0 focus:ring-0 px-0 py-2 placeholder:text-gray-300 resize-none text-lg"
        />
      </div>
    </div>
  );
};

export default ArticleEditor;
