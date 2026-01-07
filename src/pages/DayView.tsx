import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const monthNames = [
  '', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

interface Writer {
  id: string;
  name: string;
  info: string;
  imageUrl: string;
}

const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const DayView = () => {
  const { monthNumber, dayNumber } = useParams<{ monthNumber: string; dayNumber: string }>();
  const navigate = useNavigate();
  const month = parseInt(monthNumber || '1');
  const day = parseInt(dayNumber || '1');

  const [writers, setWriters] = useState<Writer[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWriter, setNewWriter] = useState({
    name: '',
    info: '',
    imageUrl: '',
  });

  const handleAddWriter = () => {
    if (newWriter.name.trim()) {
      setWriters([
        ...writers,
        {
          id: Date.now().toString(),
          ...newWriter,
        },
      ]);
      setNewWriter({ name: '', info: '', imageUrl: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteWriter = (id: string) => {
    setWriters(writers.filter(w => w.id !== id));
  };

  const getPreviousDay = () => {
    if (day === 1) {
      const prevMonth = month === 1 ? 12 : month - 1;
      return { month: prevMonth, day: daysInMonth[prevMonth] };
    }
    return { month, day: day - 1 };
  };

  const getNextDay = () => {
    if (day === daysInMonth[month]) {
      const nextMonth = month === 12 ? 1 : month + 1;
      return { month: nextMonth, day: 1 };
    }
    return { month, day: day + 1 };
  };

  const prevDay = getPreviousDay();
  const nextDay = getNextDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(`/month/${month}`)}
            className="mb-6 gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад к месяцу
          </Button>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-heading font-bold text-primary">{day}</span>
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-primary">
                  {day} {monthNames[month]}
                </h1>
                <p className="text-muted-foreground">
                  Писатели, родившиеся в этот день
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAdding(!isAdding)}
                className="gap-2"
                variant={isAdding ? "secondary" : "default"}
              >
                <Icon name={isAdding ? "X" : "Plus"} size={20} />
                {isAdding ? 'Отмена' : 'Добавить'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 p-4 bg-card/50 rounded-lg border-2 border-border">
            <Button
              variant="outline"
              onClick={() => navigate(`/day/${prevDay.month}/${prevDay.day}`)}
              className="gap-2 hover-scale"
            >
              <Icon name="ChevronLeft" size={20} />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Предыдущий день</div>
                <div className="font-semibold">{prevDay.day} {monthNames[prevDay.month]}</div>
              </div>
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <Icon name="BookMarked" size={20} />
              <span className="text-sm">Навигация по дням</span>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate(`/day/${nextDay.month}/${nextDay.day}`)}
              className="gap-2 hover-scale"
            >
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Следующий день</div>
                <div className="font-semibold">{nextDay.day} {monthNames[nextDay.month]}</div>
              </div>
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        {isAdding && (
          <Card className="mb-8 animate-fade-in border-2 border-primary/20 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <Icon name="UserPlus" size={24} />
                Новый писатель
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Имя писателя</Label>
                <Input
                  id="name"
                  placeholder="Например: Александр Пушкин"
                  value={newWriter.name}
                  onChange={(e) => setNewWriter({ ...newWriter, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="info">Информация о писателе</Label>
                <Textarea
                  id="info"
                  placeholder="Краткая биография, известные произведения..."
                  rows={4}
                  value={newWriter.info}
                  onChange={(e) => setNewWriter({ ...newWriter, info: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={newWriter.imageUrl}
                  onChange={(e) => setNewWriter({ ...newWriter, imageUrl: e.target.value })}
                />
              </div>

              <Button onClick={handleAddWriter} className="w-full gap-2">
                <Icon name="Check" size={20} />
                Сохранить писателя
              </Button>
            </CardContent>
          </Card>
        )}

        {writers.length === 0 && !isAdding && (
          <Card className="border-2 border-dashed border-border bg-card/50 animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="BookOpen" size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                Пока нет записей
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Добавьте информацию о писателях, родившихся {day} {monthNames[month]}
              </p>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Icon name="Plus" size={20} />
                Добавить первого писателя
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {writers.map((writer, index) => (
            <Card
              key={writer.id}
              className="animate-fade-in border-2 border-border bg-card overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex gap-6 flex-col md:flex-row">
                  {writer.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/20">
                        <img
                          src={writer.imageUrl}
                          alt={writer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-1">
                          {writer.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Calendar" size={16} />
                          <span>{day} {monthNames[month]}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWriter(writer.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={20} />
                      </Button>
                    </div>

                    {writer.info && (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {writer.info}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;