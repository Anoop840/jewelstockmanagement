"use client";
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