import { ThemeProvider } from '../components/ThemeProvider';
import RootClientComponent from './RootClientComponent';
import './globals.css';
import { Toaster } from '@components/ui/toaster';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Chat with a gifted one',
  description: 'Chat with a fortune teller, prophet or an astrologer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Order of class names is important so that we don't get a hydration error.
  // TODO: replace next-themes with something that can work with RSC.
  const classNames = ['h-[100dvh]', 'dark'];
  return (
    <html lang="en" className={classNames.join(' ')} style={{ colorScheme: 'dark' }}>
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-full flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RootClientComponent>{children}</RootClientComponent>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
