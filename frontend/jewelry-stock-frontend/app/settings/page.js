"use client";
import { useState, useEffect } from 'react';
import { Settings, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function SettingsPage() {
  const [adminId, setAdminId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?._id) setAdminId(parsed._id);
    }
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('http://localhost:5000/api/auth/update-password', {
        adminId,
        currentPassword,
        newPassword
      });

      setStatus({ type: 'success', message: response.data.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">System Settings</h1>
        <p className="text-sm text-slate-500">Manage security clearances, administrative configurations, and portal credentials.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <KeyRound className="h-5 w-5 text-amber-500" /> Update Authentication Credentials
        </h2>

        {status.message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${
            status.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Security Password</label>
            <input 
              type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••"
              className="w-full max-w-md px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
              <input 
                type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
              <input 
                type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit" disabled={loading}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save New Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}