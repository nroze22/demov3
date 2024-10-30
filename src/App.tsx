import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Routes } from '@/components/Routes';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="talosix-theme">
        <div className="min-h-screen bg-background">
          <Routes />
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;