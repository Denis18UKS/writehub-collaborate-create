
import { useState } from "react";
import { Share2, Calendar, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ArticleHeaderProps {
  onShare: () => void;
  onSchedule: () => void;
  onPublish: () => void;
}

export const ArticleHeader = ({
  onShare,
  onSchedule,
  onPublish
}: ArticleHeaderProps) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleScheduleSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onSchedule();
      setShowSchedule(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Новая статья</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>3 участника</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onShare} className="bg-white/80 hover:bg-white rounded-xl transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
          <Button variant="outline" onClick={() => setShowSchedule(true)} className="bg-white/80 hover:bg-white rounded-xl transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <Calendar className="mr-2 h-4 w-4" />
            Запланировать
          </Button>
          <Button onClick={onPublish} className="bg-gradient-to-r from-accent-purple/80 to-accent-cream/80 hover:from-accent-purple hover:to-accent-cream text-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
            <Send className="mr-2 h-4 w-4" />
            Опубликовать
          </Button>
        </div>
      </div>

      <Sheet open={showSchedule} onOpenChange={setShowSchedule}>
        <SheetContent className="sm:max-w-[425px] bg-neutral-100">
          <SheetHeader>
            <SheetTitle>Запланировать публикацию</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CalendarComponent 
              mode="single" 
              selected={date} 
              onSelect={handleScheduleSelect} 
              className="rounded-md border shadow-sm pointer-events-auto"
              disabled={(date) => date < new Date()} 
            />
            <p className="mt-4 text-sm text-gray-500">
              {date ? `Выбрана дата: ${date.toLocaleDateString()}` : 'Выберите дату публикации'}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ArticleHeader;
