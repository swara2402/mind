import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Menu, Heart, MessageCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function NavigationHeader({ 
  activeSection = 'chat', 
  onSectionChange 
}: { 
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'crisis', label: 'Crisis Help', icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground">
                  Sahara
                </h1>
                <Badge variant="secondary" className="text-xs -mt-1">
                  Safe Space
                </Badge>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => onSectionChange?.(item.id)}
                    className={`gap-2 ${isActive ? 'bg-secondary' : ''}`}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9"
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              data-testid="button-mobile-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-3">
          <nav className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange?.(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`mobile-nav-${item.id}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}