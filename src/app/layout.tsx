import { Header } from '../components/Header';
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
      <body className="h-screen bg-gradient-to-b from-slate-700 to-slate-900">
        <Header />
        <main className="flex flex-col justify-between items-center p-4">{children}</main>
      </body>
    </html>
  );
}
