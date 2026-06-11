"use client";
import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Store, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function SellersPage() {
  // Sellers data list state
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form inputs state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch all sellers from backend API
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/sellers');
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      alert("Could not load sellers list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Handle new seller registration submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sellers', {
        name,
        phone,
        shopName,
        email
      });

      alert('Seller profile registered successfully!');
      
      // Reset form fields
      setName('');
      setPhone('');
      setShopName('');
      setEmail('');
      
      // Refresh list
      fetchSellers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error creating seller profile');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Sellers & Agents Directory</h1>
        <p className="text-sm text-slate-500">Track partner distribution channels, contact info, and custody metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Form: Add New Agent Profile */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="h-4 w-4 text-amber-500" /> Register New Agent
          </h2>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rajesh Kumar"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
            <input 
              type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Shop Name (Optional)</label>
            <input 
              type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Apex Jewelers"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email Address (Optional)</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. rajesh@gmail.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <button type="submit" className="w-full py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-all shadow-sm">
            Save Agent Profile
          </button>
        </form>

        {/* Right Table: Active Sellers List Grid */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Active Handover Accounts</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Fetching accounts data ledger...</div>
          ) : sellers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-slate-300" />
              No agent profiles found. Register your first partner using the panel.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">Contact Contact</th>
                    <th className="p-4">Business Shop</th>
                    <th className="p-4 text-center">Outstanding Custody</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {sellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{seller.name}</td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="h-3.5 w-3.5 text-slate-400" /> {seller.phone}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Store className="h-3.5 w-3.5 text-slate-400" /> {seller.shopName || 'Individual Freelancer'}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          seller.outstandingPieces > 0 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        }`}>
                          {seller.outstandingPieces} pcs holding
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}