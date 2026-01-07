import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '@/components/AdminPanel';

const months = [
  { name: 'Январь', number: 1 },
  { name: 'Февраль', number: 2 },
  { name: 'Март', number: 3 },
  { name: 'Апрель', number: 4 },
  { name: 'Май', number: 5 },
  { name: 'Июнь', number: 6 },
  { name: 'Июль', number: 7 },
  { name: 'Август', number: 8 },
  { name: 'Сентябрь', number: 9 },
  { name: 'Октябрь', number: 10 },
  { name: 'Ноябрь', number: 11 },
  { name: 'Декабрь', number: 12 },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-6 animate-fade-in">
          <AdminPanel />
        </div>
        
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="BookOpen" size={48} className="text-primary" />
          </div>
          <h1 className="text-6xl font-bold font-heading mb-4 text-primary">
            Литературный Календарь
          </h1>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Календарь дней рождения писателей и литературных событий
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map((month, index) => (
            <Card
              key={month.number}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in border-2 border-border bg-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/month/${month.number}`)}
            >
              <div className="p-8 relative z-10">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon name="Book" size={80} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Calendar" size={24} className="text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground">
                      {month.number.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                    {month.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Feather" size={16} />
                    <span>Писатели месяца</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Открыть календарь</span>
                  <Icon name="ArrowRight" size={20} />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        <footer className="mt-16 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="Sparkles" size={20} />
            <p className="text-sm">Сохраняйте память о великих литераторах</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;