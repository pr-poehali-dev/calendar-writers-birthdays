import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'writers-calendar';

export const AdminPanel = () => {
  const { isAdmin, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogin = () => {
    if (login(password)) {
      setPassword('');
      setError('');
      setLoginOpen(false);
    } else {
      setError('Неверный пароль');
    }
  };

  const handleExport = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      alert('Нет данных для экспорта');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writers-calendar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content);
        localStorage.setItem(STORAGE_KEY, content);
        alert('Данные успешно импортированы! Обновите страницу.');
        window.location.reload();
      } catch (error) {
        alert('Ошибка при импорте файла. Проверьте формат JSON.');
      }
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2" size="sm">
            <Icon name="Lock" size={16} />
            Войти как администратор
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Icon name="Key" size={24} />
              Вход для администратора
            </DialogTitle>
            <DialogDescription>
              Введите пароль для получения прав редактирования календаря
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
            <Button onClick={handleLogin} className="w-full gap-2">
              <Icon name="LogIn" size={20} />
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Режим администратора</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Icon name="Download" size={16} />
                Экспорт
              </Button>
              <label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button variant="outline" size="sm" asChild className="gap-2 cursor-pointer">
                  <span>
                    <Icon name="Upload" size={16} />
                    Импорт
                  </span>
                </Button>
              </label>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
