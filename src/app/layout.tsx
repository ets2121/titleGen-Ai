import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TitleForge AI | AI-Powered Capstone & Thesis Title Generator',
    template: `%s | TitleForge AI`,
  },
  description: 'Generate innovative and relevant capstone and thesis titles with TitleForge AI. Get suggestions for tech stacks, objectives, and implementation steps for your academic projects.',
  keywords: ['capstone project', 'thesis title generator', 'AI project ideas', 'research topics', 'academic projects', 'project title generator', 'final year project', 'Mark John Valdez'],
  authors: [{ name: 'Mark John Valdez' }],
  creator: 'Mark John Valdez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://titleforge.ai',
    siteName: 'TitleForge AI',
    title: 'TitleForge AI | AI-Powered Capstone & Thesis Title Generator',
    description: 'Generate innovative and relevant capstone and thesis titles with TitleForge AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TitleForge AI | AI-Powered Capstone & Thesis Title Generator',
    description: 'Generate innovative and relevant capstone and thesis titles with TitleForge AI.',
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
