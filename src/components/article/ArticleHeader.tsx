
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
          <h1 className="text-2xl font-serif font-bold text-gray-900">Новая статья</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-accent-cream/50 py-1 px-3 rounded-full">
            <Users className="w-4 h-4" />
            <span>3 участника</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onShare} 
            className="bg-white hover:bg-accent-cream rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-gray-100"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowSchedule(true)} 
            className="bg-white hover:bg-accent-sky/20 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-gray-100"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Запланировать
          </Button>
          <Button 
            onClick={onPublish} 
            className="bg-gradient-to-r from-accent-purple to-accent-sage text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0"
          >
            <Send className="mr-2 h-4 w-4" />
            Опубликовать
          </Button>
        </div>
      </div>

      <Sheet open={showSchedule} onOpenChange={setShowSchedule}>
        <SheetContent className="sm:max-w-[425px] bg-white border-l border-gray-100">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl">Запланировать публикацию</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CalendarComponent 
              mode="single" 
              selected={date} 
              onSelect={handleScheduleSelect} 
              className="rounded-xl border shadow-sm bg-white"
              disabled={(date) => date < new Date()} 
              classNames={{
                day_selected: "bg-accent-purple text-white hover:bg-accent-purple/90",
                day_today: "bg-accent-cream text-accent-purple",
              }}
            />
            <p className="mt-6 text-sm text-gray-600 bg-accent-cream/30 p-4 rounded-lg">
              {date 
                ? `Выбрана дата: ${date.toLocaleDateString()}` 
                : 'Выберите дату публикации'}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ArticleHeader;
