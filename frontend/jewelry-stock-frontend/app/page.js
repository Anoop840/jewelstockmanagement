"use client";
import { useState, useEffect } from 'react';
import { Gem, Users, History, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [stats, setStats] = useState({ totalInHouse: 0, totalSellers: 0, totalOutstanding: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error loading dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
  if (!storedUser) {
    window.location.href = '/login'; // Bounce back to auth panel instantly
    return;
  }

  fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Welcome back, Administrator. Here is your real-time consignment summary.</p>
        </div>
        <button onClick={fetchStats} className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Real-time Dynamic Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Total In-Vault Stock</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {loading ? "..." : `${stats.totalInHouse} pcs`}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Gem className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Active Sellers / Agents</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {loading ? "..." : `${stats.totalSellers} active`}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Total Outstanding Credit</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">
              {loading ? "..." : `${stats.totalOutstanding} pcs`}
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <History className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}