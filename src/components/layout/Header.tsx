import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Home, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center space-x-6">
            <img 
              src="https://staging.study.talosix.com/images/talosix-logo.png" 
              alt="Talosix Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Study Jump Start
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}