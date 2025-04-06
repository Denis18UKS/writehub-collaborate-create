import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ArticleHeader from '../components/article/ArticleHeader';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FaComments } from 'react-icons/fa';

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ? parseInt(id) : undefined;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: number, name: string }[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const senderId = parseInt(localStorage.getItem('user_id') || '0');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/messages", {
          params: { articleId }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке сообщений:", error);
      }
    };

    if (articleId) {
      fetchMessages();
    }

    fetchTags();
    fetchArticle();
  }, [articleId, toast]);

  useEffect(() => {
    if (!articleId) return;

    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("joinRoom", articleId);

    socketRef.current.on("receiveMessage", (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socketRef.current.emit("leaveRoom", articleId);
      socketRef.current.disconnect();
    };
  }, [articleId]);

  const sendMessage = () => {
    if (newMessage.trim() && articleId && senderId !== 0) {
      socketRef.current.emit('sendMessage', { message: newMessage, articleId, senderId });
      setNewMessage('');
    }
  };

  const updateArticle = async () => {
    if (!articleId) return;
    try {
      await axios.put(`http://localhost:5000/api/articles/${articleId}`, {
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

        <div className="flex-1 p-6 max-w-screen-lg mx-auto w-full flex gap-6">
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-6 flex-1">
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
          </div>

          {/* Кнопка для открытия чата */}
          <div
            onClick={() => setIsChatVisible(!isChatVisible)}
            className="fixed top-6 right-6 bg-purple-600 text-white p-3 rounded-full cursor-pointer hover:bg-purple-700 z-[9999]"
          >
            <FaComments size={24} />
          </div>

          {/* Чат */}
          {isChatVisible && (
            <div className="w-full max-w-md bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-lg fixed bottom-6 right-6 z-[9999]">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Чат обсуждения</h3>
              <div className="flex flex-col space-y-4 mb-4 h-[400px] overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className="p-3 bg-white shadow-md rounded-lg text-sm text-gray-700">
                    <strong>{msg.username}</strong>: {msg.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <Textarea
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full min-h-[50px] border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 px-3 py-2 placeholder:text-gray-500 resize-none text-sm"
              />
              <button
                onClick={sendMessage}
                className="w-full mt-2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
              >
                Отправить
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditArticle;
