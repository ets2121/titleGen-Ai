import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const ogImage = PlaceHolderImages.find(img => img.id === 'og-image');

export const metadata: Metadata = {
  title: {
    default: 'TitleGen Ai | AI-Powered Capstone & Thesis Title Generator',
    template: `%s | TitleGen Ai`,
  },
  description: 'Generate innovative and relevant capstone and thesis titles with TitleGen Ai. Get suggestions for tech stacks, objectives, and implementation steps for your academic projects.',
  keywords: ['capstone project', 'thesis title generator', 'AI project ideas', 'research topics', 'academic projects', 'project title generator', 'final year project', 'Mark John Valdez'],
  authors: [{ name: 'Mark John Valdez' }],
  creator: 'Mark John Valdez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://titlegen.vercel.app',
    siteName: 'TitleGen Ai',
    title: 'TitleGen Ai | AI-Powered Capstone & Thesis Title Generator',
    description: 'Generate innovative and relevant capstone and thesis titles with TitleGen Ai.',
    images: ogImage ? [
      {
        url: ogImage.imageUrl,
        width: 800,
        height: 420,
        alt: ogImage.description,
      }
    ] : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TitleGen Ai | AI-Powered Capstone & Thesis Title Generator',
    description: 'Generate innovative and relevant capstone and thesis titles with TitleGen Ai.',
    images: ogImage ? [ogImage.imageUrl] : [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
