import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Billiard Trx',
  description: 'Manage Billiard Rentals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <nav className="navbar glass-panel">
            <Link href="/" className="logo">Billiard Trx</Link>
            <div className="nav-links">
              <Link href="/transactions">Dashboard</Link>
              <Link href="/input">Input</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/dividends">Dividends</Link>
            </div>
          </nav>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
