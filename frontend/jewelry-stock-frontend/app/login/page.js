"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gem, Lock, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Save the admin details and secure token string into LocalStorage
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      
      // Redirect straight to the main overview dashboard panel
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password combination.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Branding Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/10 rounded-xl text-amber-500 mb-3">
            <Gem className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">JewelStock Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to access secure inventory credit ledgers.</p>
        </div>

        {/* Error Feedback Panel */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2.5 text-xs font-medium text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Interactive Fields Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Management Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@jewelstock.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-600 font-semibold text-sm text-slate-950 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Authenticating Master..." : "Unlock Vault Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}