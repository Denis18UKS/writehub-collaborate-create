import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleHeader from '../components/article/ArticleHeader.tsx';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ? parseInt(id) : undefined; // Преобразуем id в число
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: number, name: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tags');
        setAvailableTags(response.data);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось получить теги.',
          variant: 'destructive',
        });
      }
    };

    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/articles/${articleId}`);
        const article = response.data;
        setTitle(article.title);
        setContent(article.content);
        setExcerpt(article.excerpt);
        setCoverImage(article.cover_image);
        setStatus(article.status);
        setTags(article.tags);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить статью.',
          variant: 'destructive',
        });
      }
    };

    fetchTags();
    fetchArticle();
  }, [articleId, toast]);

  const updateArticle = async () => {
    if (!articleId) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/articles/${articleId}`, {
        title,
        content,
        excerpt,
        cover_image: coverImage,
        status,
        tags,
      });

      toast({
        title: 'Статья обновлена!',
        description: 'Ваша статья успешно обновлена.',
        className: 'bg-accent-sky border-accent-sky',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error?.response?.data?.message || 'Не удалось обновить статью',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = () => {
    if (!title) {
      toast({
        title: 'Заголовок обязателен',
        description: 'Пожалуйста, добавьте заголовок перед публикацией.',
        variant: 'destructive',
      });
      return;
    }

    if (!content || content.length < 50) {
      toast({
        title: 'Недостаточно контента',
        description: 'Пожалуйста, добавьте больше содержания перед публикацией.',
        variant: 'destructive',
      });
      return;
    }

    updateArticle();
  };

  return (
    <DashboardLayout>
    <div className="min-h-full flex flex-col">
      <div className="bg-white p-6 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <ArticleHeader onPublish={handlePublish} title={title} />
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
          <input
            type="text"
            placeholder="Заголовок статьи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-serif font-bold border-0 border-b border-transparent focus:border-gray-200 focus:ring-0 px-0 py-2 mb-6 placeholder:text-gray-300"
          />

          <Textarea
            placeholder="Начните писать свою историю..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] border-0 focus:ring-0 px-0 py-2 placeholder:text-gray-300 resize-none text-lg"
          />

          {/* Выбор тегов */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Добавить тег</label>
            <div className="flex gap-2">
              <select
                value=""
                onChange={(e) => {
                  const selectedTagId = parseInt(e.target.value);
                  if (!tags.includes(selectedTagId)) {
                    setTags([...tags, selectedTagId]);
                  }
                }}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Выберите тег...</option>
                {availableTags
                  .filter(tag => !tags.includes(tag.id))
                  .map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </select>
            </div>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map(tagId => {
                  const tag = availableTags.find(t => t.id === tagId);
                  return (
                    <div
                      key={tagId}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {tag?.name}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter(id => id !== tagId))}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default EditArticle;
