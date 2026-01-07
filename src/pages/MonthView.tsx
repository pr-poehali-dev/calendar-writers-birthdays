import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const monthNames = [
  '', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MonthView = () => {
  const { monthNumber } = useParams<{ monthNumber: string }>();
  const navigate = useNavigate();
  const month = parseInt(monthNumber || '1');
  const days = Array.from({ length: daysInMonth[month] }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад к месяцам
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Calendar" size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-heading font-bold text-primary">
                {monthNames[month]}
              </h1>
              <p className="text-muted-foreground text-lg">
                Выберите день для просмотра писателей
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {days.map((day, index) => (
            <Card
              key={day}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in border-2 border-border bg-card"
              style={{ animationDelay: `${index * 0.02}s` }}
              onClick={() => navigate(`/day/${month}/${day}`)}
            >
              <div className="p-6 text-center relative z-10">
                <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon name="Feather" size={40} className="text-primary" />
                </div>

                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  {day}
                </div>
                
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Icon name="BookMarked" size={12} />
                  <span>{monthNames[month]}</span>
                </div>

                <div className="mt-3 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Открыть →
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
