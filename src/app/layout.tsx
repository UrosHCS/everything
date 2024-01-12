import { ThemeProvider } from '../components/ThemeProvider';
import RootClientComponent from './RootClientComponent';
import './globals.css';
import { Toaster } from '@components/ui/toaster';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Chat with a gifted one',
  description: 'Chat with a fortune teller, prophet or an astrologer.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-[100dvh] ${inter.className}`}>
      <body className="flex h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RootClientComponent>{children}</RootClientComponent>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
