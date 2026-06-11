"use client";
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if the manager is currently looking at the login page path route
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {isLoginPage ? (
          // Clean layout wrapping frame purely for Auth Screens
          <div className="min-h-screen bg-slate-950">
            {children}
          </div>
        ) : (
          // Full Dashboard layout frame configuration featuring permanent sidebar
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pl-64 bg-slate-50 min-h-screen">
              <div className="p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}