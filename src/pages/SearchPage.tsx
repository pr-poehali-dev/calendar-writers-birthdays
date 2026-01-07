import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { AdminPanel } from '@/components/AdminPanel';

const monthNames = [
  '', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const allTags = ['поэт', 'прозаик', 'драматург', 'классик', 'современник', 'лауреат'];

interface Writer {
  id: number;
  name: string;
  info: string;
  image_url: string;
  month: number;
  day: number;
  tags: string[];
}

const SearchPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, byMonth: {} as Record<number, number> });

  const API_URL = 'https://functions.poehali.dev/af9d6b8c-fecf-4e75-a60a-162ee0d09e5d';

  useEffect(() => {
    fetchWriters();
  }, [search, selectedTag]);

  const fetchWriters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      setWriters(data);

      // Подсчёт статистики
      const byMonth: Record<number, number> = {};
      data.forEach((w: Writer) => {
        byMonth[w.month] = (byMonth[w.month] || 0) + 1;
      });
      setStats({ total: data.length, byMonth });
    } catch (error) {
      console.error('Error fetching writers:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareWriter = (writer: Writer) => {
    const text = `${writer.name} — родился ${writer.day} ${monthNames[writer.month]}`;
    const url = window.location.origin + `/day/${writer.month}/${writer.day}`;
    
    if (navigator.share) {
      navigator.share({ title: writer.name, text, url });
    } else {
      // Fallback для VK
      const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(vkUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-start mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            На главную
          </Button>
          <AdminPanel />
        </div>

        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Search" size={48} className="text-primary" />
          </div>
          <h1 className="text-5xl font-heading font-bold mb-4 text-primary">
            Поиск писателей
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Найдите любимого автора или откройте для себя нового
          </p>
        </header>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Всего писателей</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {Object.keys(stats.byMonth).length}
              </div>
              <div className="text-sm text-muted-foreground">Заполнено месяцев</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {Math.max(...Object.values(stats.byMonth), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Макс. в месяце</div>
            </CardContent>
          </Card>
        </div>

        {/* Поиск */}
        <Card className="mb-8 border-2 border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Введите имя писателя..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {search && (
                <Button variant="ghost" onClick={() => setSearch('')}>
                  <Icon name="X" size={20} />
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">Теги:</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover-scale"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Результаты */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : writers.length === 0 ? (
          <Card className="border-2 border-dashed border-border bg-card/50">
            <CardContent className="py-16 text-center">
              <Icon name="BookOpen" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {writers.map((writer, index) => (
              <Card
                key={writer.id}
                className="animate-fade-in border-2 border-border bg-card hover:shadow-lg transition-shadow cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/day/${writer.month}/${writer.day}`)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {writer.image_url && (
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20">
                          <img
                            src={writer.image_url}
                            alt={writer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-primary mb-2">
                        {writer.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Icon name="Calendar" size={16} />
                        <span>{writer.day} {monthNames[writer.month]}</span>
                      </div>
                      
                      {writer.tags && writer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {writer.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareWriter(writer);
                        }}
                        className="gap-2"
                      >
                        <Icon name="Share2" size={16} />
                        Поделиться
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
