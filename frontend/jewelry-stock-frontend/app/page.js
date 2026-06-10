export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Administrator. Here is your consignment summary.</p>
      </div>
      
      {/* Dynamic Placeholder Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Total In-Vault Stock</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">-- pieces</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Active Sellers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">-- agents</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500 tracking-wider">Total Outstanding Credit</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">-- items pending</p>
        </div>
      </div>
    </div>
  );
}