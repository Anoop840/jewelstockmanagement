"use client";
import { useState } from 'react';
import { Plus, Trash2, PackagePlus } from 'lucide-react';
import axios from 'axios';

export default function ProductsPage() {
  // Master Product Form State
  const [itemCode, setItemCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ring');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  
  // MATCHED WITH SCHEMA: Changed 'stock' to 'stockInHouse'
  const [variants, setVariants] = useState([
    { color: '', sku: '', stockInHouse: 0, details: '' }
  ]);

  // Handle changes inside the specific index variant block
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  // MATCHED WITH SCHEMA: Using 'stockInHouse' here too
  const addVariantRow = () => {
    setVariants([...variants, { color: '', sku: '', stockInHouse: 0, details: '' }]);
  };

  // Remove a variant input row
  const removeVariantRow = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  // Handle native file selection
  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Submit everything via multipart/form-data to our Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('itemCode', itemCode);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      
      // Append variants array as a stringified block for Multer compatibility
      formData.append('variants', JSON.stringify(variants));
      
      // Append uploaded image raw streams
      images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Product created successfully inside the database!');
      
      // Reset form fields
      setItemCode('');
      setTitle('');
      setDescription('');
      // MATCHED WITH SCHEMA: Reset cleanly using 'stockInHouse'
      setVariants([{ color: '', sku: '', stockInHouse: 0, details: '' }]);
      setImages([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error processing product creation');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Inventory Master</h1>
        <p className="text-sm text-slate-500">Create new catalog items and distribute stock variations dynamically.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <PackagePlus className="h-5 w-5 text-amber-500" /> General Details
        </h2>

        {/* Form Inputs Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Item Code (Unique ID)</label>
            <input 
              type="text" required value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="e.g. GG101"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Product Title</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Classic Designer Diamond Band"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
              <option value="Ring">Ring</option>
              <option value="Necklace">Necklace</option>
              <option value="Bangle">Bangle</option>
              <option value="Earrings">Earrings</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Upload Product Photos</label>
            <input 
              type="file" multiple onChange={handleFileChange} accept="image/*"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Item Description</label>
          <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional design specifications..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"/>
        </div>

        {/* Dynamic Variants Rows */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Color Profile Variants & Initial Vault Stock</h3>
            <button type="button" onClick={addVariantRow} className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all">
              <Plus className="h-3.5 w-3.5" /> Add Color Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-3 items-end border border-slate-100 p-3 bg-slate-50/50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Color Name</label>
                  <input type="text" required placeholder="e.g. Rose Gold" value={variant.color || ''} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"/>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Variant SKU</label>
                  <input type="text" required placeholder="e.g. GG101-ROSE" value={variant.sku || ''} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"/>
                </div>
                {/* MATCHED WITH SCHEMA: Pointed field and value properties to 'stockInHouse' */}
                <div className="w-28">
                  <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Vault Stock</label>
                  <input type="number" required min="0" value={variant.stockInHouse || 0} onChange={(e) => handleVariantChange(index, 'stockInHouse', parseInt(e.target.value) || 0)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"/>
                </div>
                <div className="flex-[1.5]">
                  <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Details/Notes</label>
                  <input type="text" placeholder="Purity, layout information..." value={variant.details || ''} onChange={(e) => handleVariantChange(index, 'details', e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"/>
                </div>
                <button type="button" disabled={variants.length === 1} onClick={() => removeVariantRow(index)} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-100 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 bg-white transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 shadow-sm transition-all">
            Save Product to Stock
          </button>
        </div>
      </form>
    </div>
  );
}