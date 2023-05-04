import Session from './Session';
import './globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-screen ${inter.className}`}>
      <body className="flex h-full flex-col bg-gradient-to-b from-purple-900 to-purple-950">
        <Session>{children}</Session>
      </body>
    </html>
  );
}
