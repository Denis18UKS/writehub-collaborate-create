
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import ArticleEdit from "./pages/ArticleEdit";
import Profile from "./pages/Profile";
import Ideas from "./pages/Ideas";
import NotFound from "./pages/NotFound";
import EditArticle from './pages/EditArticle';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/articles" element={<Articles />} />
          <Route path="/dashboard/articles/:id/create" element={<ArticleEdit />} />
          <Route path="/dashboard/articles/new" element={<ArticleEdit />} />
          <Route path="/dashboard/articles/:id/edit" element={<EditArticle />} />
          <Route path="/dashboard/articles/:id" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/ideas" element={<Ideas />} />
          <Route path="/logout" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
