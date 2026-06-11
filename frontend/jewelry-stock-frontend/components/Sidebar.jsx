"use client";
<<<<<<< HEAD
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gem, Users, History } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/products', icon: Gem },
    { name: 'Sellers / Agents', href: '/sellers', icon: Users },
    { name: 'Consignment Ledger', href: '/consignment', icon: History },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
      {/* Branding Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <Gem className="h-6 w-6 text-amber-500" />
        <span className="font-bold text-lg tracking-wide">JewelStock</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Meta */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0 • Credit Basis System
      </div>
    </div>
  );
};

export default Sidebar;
=======
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Gem, LayoutDashboard, Package, Users, Receipt, LogOut, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState('Administrator');

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setAdminName(parsed.name);
      } catch (err) {
        console.error("Error parsing admin session data", err);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('adminUser');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/products', icon: Package },
    { name: 'Sellers / Agents', href: '/sellers', icon: Users },
    { name: 'Consignment Ledger', href: '/consignment', icon: Receipt },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-400 fixed inset-y-0 left-0 flex flex-col justify-between z-30">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">JewelStock</h2>
            <p className="text-[10px] text-slate-500 font-medium">v1.0 • Credit Basis System</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* NEW: Bottom Action Footnote Profile and Sign-Out Control */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <div className="px-3 py-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Session</p>
          <p className="text-xs font-bold text-slate-300 truncate mt-0.5">{adminName}</p>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/10 text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out Portal
        </button>
      </div>
    </aside>
  );
}
>>>>>>> 8ba7fcc72d2f3f230a8061448fcc36072d81ffbc
