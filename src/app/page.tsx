import { Facebook, Sparkles, MessageCircle } from 'lucide-react';
import TitleForgeClient from '@/components/title-forge-client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
              TitleGen Ai
            </h1>
            <p className="text-muted-foreground">Mrk_vldz</p>
          </div>
        </div>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Generate your next capstone or thesis title with the power of AI. Simply select your field, topic, and difficulty to get started.
        </p>
      </header>
      <main className="flex-grow container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <TitleForgeClient />
      </main>
      <footer className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            By Mark John Valdez | Powered by Google AI.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/share/1JQ2fBEJma/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://m.me/4d61726b6a6f686eVALDEZ" target="_blank" rel="noopener noreferrer" aria-label="Messenger" className="text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
