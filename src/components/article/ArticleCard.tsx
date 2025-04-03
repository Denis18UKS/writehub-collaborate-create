
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  status: 'draft' | 'published' | 'scheduled';
  collaborators?: number;
}

const ArticleCard = ({
  id,
  title,
  excerpt,
  coverImage,
  createdAt,
  status,
  collaborators = 0
}: ArticleCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'published':
        return <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Опубликовано</span>;
      case 'scheduled':
        return <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">Запланировано</span>;
      case 'draft':
      default:
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Черновик</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {coverImage && (
        <div className="h-40 overflow-hidden rounded-t-xl">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          {getStatusBadge()}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-gray-500 text-xs">
            {createdAt} {collaborators > 0 && `• ${collaborators} соавтор${collaborators === 1 ? '' : 'а'}`}
          </div>
          <Button variant="outline" size="sm" className="text-accent-purple border-accent-purple" asChild>
            <Link to={`/dashboard/articles/${id}/edit`}>
              <Edit className="mr-2 h-3 w-3" />
              Редактировать
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
