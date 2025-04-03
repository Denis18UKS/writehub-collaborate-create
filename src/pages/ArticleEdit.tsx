
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ArticleEditor from '@/components/article/ArticleEditor';

const ArticleEdit = () => {
  return (
    <DashboardLayout>
      <div className="bg-accent-cream/10 min-h-full rounded-xl animate-fade-in">
        <ArticleEditor />
      </div>
    </DashboardLayout>
  );
};

export default ArticleEdit;
