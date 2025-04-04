import { useState } from "react";
import { Share2, Calendar, Send, Users, Clock, Copy, Check, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ArticleHeaderProps {
  onPublish: () => void;
  onShare?: (permission: string) => Promise<string>;  // Добавлен параметр permission
  onSchedule?: (date: Date, time: string) => void;
  title?: string;
}

export const ArticleHeader = ({
  onShare,
  onSchedule,
  onPublish,
  title = "Новая статья"
}: ArticleHeaderProps) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [permission, setPermission] = useState("edit");
  const [expiresIn, setExpiresIn] = useState("7"); // По умолчанию 7 дней

  const handleScheduleClick = () => {
    if (date && onSchedule) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes);
      
      onSchedule(scheduledDate, time);
      setShowSchedule(false);
    }
  };

  const handleShareClick = () => {
    setShowShareDialog(true);
  };

  const generateShareLink = async () => {
    if (onShare) {
      setIsGeneratingLink(true);
      try {
        const link = await onShare(permission);
        setShareLink(link);
        setIsGeneratingLink(false);
      } catch (error) {
        console.error("Ошибка при создании ссылки:", error);
        setIsGeneratingLink(false);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-serif font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-accent-cream/50 py-1 px-3 rounded-full">
            <Users className="w-4 h-4" />
            <span>3 участника</span>
          </div>
        </div>
        <div className="flex gap-3">
          {/* Кнопка Поделиться */}
          <Button 
            variant="outline" 
            onClick={handleShareClick}
            className="bg-white hover:bg-accent-cream rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-gray-100"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
          
          {/* Кнопка Запланировать */}
          <Button 
            variant="outline" 
            onClick={() => setShowSchedule(true)} 
            className="bg-white hover:bg-accent-sky/20 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-gray-100"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Запланировать
          </Button>
          
          {/* Кнопка Опубликовать */}
          <Button 
            onClick={onPublish} 
            className="bg-gradient-to-r from-accent-purple to-accent-sage text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0"
          >
            <Send className="mr-2 h-4 w-4" />
            Опубликовать
          </Button>
        </div>
      </div>

      {/* Модальное окно для запланированного времени публикации */}
      <Sheet open={showSchedule} onOpenChange={setShowSchedule}>
        <SheetContent className="sm:max-w-[425px] bg-white border-l border-gray-100">
          <SheetHeader className="pb-4">
            <SheetTitle className="font-serif text-2xl">Запланировать публикацию</SheetTitle>
          </SheetHeader>
          {/* Содержимое не меняется */}
          <div className="py-4">
            <CalendarComponent 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="rounded-xl border shadow-sm bg-white"
              disabled={(date) => date < new Date()}
              classNames={{
                day_selected: "bg-accent-purple text-white hover:bg-accent-purple/90",
                day_today: "bg-accent-cream text-accent-purple",
              }}
            />
            
            <div className="mt-6 space-y-4">
              {date && (
                <div className="bg-accent-cream/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Выбрана дата: {format(date, "d MMMM yyyy", { locale: ru })}
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <label htmlFor="time-input" className="text-sm text-gray-600">
                      Выберите время:
                    </label>
                    <Input
                      id="time-input"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-24 py-1 text-center"
                    />
                  </div>
                </div>
              )}
              
              {!date && (
                <p className="text-sm text-gray-600 bg-accent-cream/30 p-4 rounded-lg">
                  Выберите дату публикации
                </p>
              )}
            </div>
          </div>
          
          <SheetFooter className="mt-4">
            <Button
              onClick={handleScheduleClick}
              disabled={!date}
              className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl transition-all duration-300"
            >
              Запланировать публикацию
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Диалоговое окно для создания ссылки доступа */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Поделиться статьей</DialogTitle>
            <DialogDescription>
              Создайте ссылку для доступа к вашей статье и поделитесь ею с другими пользователями.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-6">
              {!shareLink ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Уровень доступа</h3>
                    
                    <RadioGroup 
                      defaultValue="edit" 
                      value={permission} 
                      onValueChange={setPermission}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-accent-purple transition-colors">
                      <RadioGroupItem value="edit" id="edit" className="border-accent-purple" />
                        <Label htmlFor="edit" className="flex items-center cursor-pointer">
                          <Lock className="h-4 w-4 mr-2 text-accent-purple" />
                          <div>
                            <div className="font-medium">Редактирование</div>
                            <div className="text-xs text-gray-500">Разрешить просмотр и редактирование</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-accent-purple transition-colors">
                        <RadioGroupItem value="read" id="read" className="border-accent-purple" />
                        <Label htmlFor="read" className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2 text-accent-purple" />
                          <div>
                            <div className="font-medium">Только просмотр</div>
                            <div className="text-xs text-gray-500">Разрешить только просмотр</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Срок действия ссылки</h3>
                    
                    <Tabs 
                      defaultValue="7"
                      value={expiresIn}
                      onValueChange={setExpiresIn}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="1">1 день</TabsTrigger>
                        <TabsTrigger value="7">7 дней</TabsTrigger>
                        <TabsTrigger value="30">30 дней</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <Button 
                    onClick={generateShareLink} 
                    disabled={isGeneratingLink} 
                    className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white"
                  >
                    {isGeneratingLink ? "Создание ссылки..." : "Создать ссылку"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-accent-cream/30 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Ссылка создана:</h3>
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={shareLink} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        onClick={copyToClipboard} 
                        variant="outline" 
                        size="icon"
                        className={copied ? "bg-green-100" : ""}
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="flex items-start">
                      <span className="mr-2">ℹ️</span>
                      {permission === "edit" ? (
                        <span>По этой ссылке пользователи смогут редактировать статью. Ссылка будет действительна {expiresIn} дней.</span>
                      ) : (
                        <span>По этой ссылке пользователи смогут только просматривать статью. Ссылка будет действительна {expiresIn} дней.</span>
                      )}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setShareLink("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Создать новую ссылку
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            {shareLink && (
              <Button 
                onClick={() => setShowShareDialog(false)}
                className="bg-accent-purple hover:bg-accent-purple/90 text-white"
              >
                Закрыть
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleHeader;