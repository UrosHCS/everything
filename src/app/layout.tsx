import RootClientComponent from './RootClientComponent';
import './globals.css';
import { Toaster } from '@components/ui/toaster';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get('theme')?.value || 'dark';

  return (
    <html lang="en" className={`h-[100dvh] ${theme}`} style={{ colorScheme: 'dark' }}>
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-full flex-col antialiased`}>
        <RootClientComponent>{children}</RootClientComponent>
        <Toaster />
      </body>
    </html>
  );
}
