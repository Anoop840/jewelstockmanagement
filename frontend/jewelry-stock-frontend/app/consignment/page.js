"use client";
import { useState, useEffect } from 'react';
import { History, Send, Layers, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function ConsignmentPage() {
  // Master lists from database
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVariantSku, setSelectedVariantSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Fetch initial dropdown options data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sellersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/sellers'),
          axios.get('http://localhost:5000/api/products')
        ]);
        setSellers(sellersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error loading ledger dependencies:", error);
        alert("Failed to initialize handover configurations.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter out and grab the specific variants available for the chosen product
  const activeProductDoc = products.find(p => p._id === selectedProduct);
  const availableVariants = activeProductDoc ? activeProductDoc.variants : [];

  // Handle stock issuance submit
  const handleIssueStock = async (e) => {
    e.preventDefault();
    if (!selectedSeller || !selectedProduct || !selectedVariantSku || quantity < 1) {
      alert("Please fill out all handover fields completely.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/ledger/issue', {
        sellerId: selectedSeller,
        items: [
          {
            productId: selectedProduct,
            variantSku: selectedVariantSku,
            quantity: Number(quantity)
          }
        ],
        notes
      });

      alert(`Successfully issued ${quantity} pieces to the agent account!`);
      
      // Reset input counters
      setQuantity(1);
      setNotes('');
      
      // Refresh local view data to update vault status counts
      const productsRes = await axios.get('http://localhost:5000/api/products');
      setProducts(productsRes.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error processing consignment issue transaction.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading master handover options framework...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Consignment Ledger Engine</h1>
        <p className="text-sm text-slate-500">Authorize credit handovers and dispatch physical inventory assets to agents.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Issue Form */}
        <form onSubmit={handleIssueStock} className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Send className="h-5 w-5 text-amber-500" /> New Consignment Handover Dispatch
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Step 1: Select Agent */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">1. Choose Recipient Agent</label>
              <select 
                required value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
              >
                <option value="">-- Select Agent --</option>
                {sellers.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.shopName || 'Freelancer'})</option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Master Item */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">2. Select Catalog Product</label>
              <select 
                required value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value); setSelectedVariantSku(''); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
              >
                <option value="">-- Select Jewelry Item --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.itemCode} - {p.title}</option>
                ))}
              </select>
            </div>

            {/* Step 3: Select Color Profile Variant */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">3. Select Color Variant SKU</label>
              <select 
                required disabled={!selectedProduct} value={selectedVariantSku} onChange={(e) => setSelectedVariantSku(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 disabled:opacity-50 focus:outline-none"
              >
                <option value="">-- Choose Color Profile --</option>
                {availableVariants.map(v => (
                  <option key={v.sku} value={v.sku}>{v.color} (Vault Stock: {v.stockInHouse} pcs)</option>
                ))}
              </select>
            </div>

            {/* Step 4: Dispatch Volume */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">4. Quantity to Handover</label>
              <input 
                type="number" required min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Dispatch Remarks / Notes</label>
            <input 
              type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Issued for wedding exhibition showcase inventory"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
              Confirm Ledger & Issue Stock
            </button>
          </div>
        </form>

        {/* Right Info Card Context Block */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-xl p-5 shadow-sm space-y-4 border border-slate-800">
          <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-slate-700 pb-2">
            <Layers className="h-4 w-4 text-amber-500" /> System Regulations
          </h3>
          <ul className="space-y-3 text-xs text-slate-400 list-disc pl-4">
            <li>Issuing inventory instantly logs a record inside the permanent database ledger history journals.</li>
            <li>Vault records count balance levels will immediately decrement based on values processed here.</li>
            <li>Handovers do not involve explicit storefront digital point of sale card authorization layers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}