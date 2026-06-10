import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jewelry Stock Management Portal',
  description: 'B2B Consignment & Credit Ledger',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 global-layout-setup`}>
        <div className="flex min-h-screen">
          {/* Permanent Navigation Sidebar */}
          <Sidebar />

          {/* Main Workspace Frame */}
          <main className="flex-1 pl-64 bg-slate-50 min-h-screen">
            <div className="p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}