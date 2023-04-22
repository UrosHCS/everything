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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900">
        <Session>{children}</Session>
      </body>
    </html>
  );
}
