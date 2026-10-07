import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Product } from '../../types/bakery.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const CATEGORIES = ['Cakes', 'Cupcakes', 'Brownies', 'Cookies', 'Custom Cakes'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0],
    price: 599,
    imageUrl: '',
    available: true
  });

  const { showToast } = useToast();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: CATEGORIES[0],
      price: 599,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
      available: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      imageUrl: p.imageUrl,
      available: p.available
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        available: !product.available
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      showToast(
        `${product.name} is now ${!product.available ? 'available' : 'marked as sold out'}`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability', 'error');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}" from the menu?`)) {
      return;
    }
    try {
      await api.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Product removed successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      showToast('Please provide valid product details', 'error');
      return;
    }

    try {
      setModalSaving(true);
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: Number(formData.price),
          imageUrl: formData.imageUrl.trim(),
          available: formData.available
        });
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
        showToast('Product updated successfully!', 'success');
      } else {
        const created = await api.createProduct({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: Number(formData.price),
          imageUrl: formData.imageUrl.trim(),
          available: formData.available
        });
        setProducts((prev) => [...prev, created]);
        showToast('New bake added to menu!', 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-script text-2xl text-[#C85A32]">cabinet management</span>
          <h1 className="font-serif text-3xl font-bold text-[#2B1E16] mt-0.5">
            Bakery Products
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4537] mt-1 font-light">
            Manage your boutique menu items, pricing, availability, and descriptions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Treat</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#735A4C]">Loading bakery catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className={`bg-[#FAF7F0] rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                p.available ? 'border-[#EAE3D9] shadow-sm' : 'border-stone-300 opacity-75'
              }`}
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#FDFBF7]/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-[#4A3528]">
                    {p.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        p.available
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-700 text-white'
                      }`}
                    >
                      {p.available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#2B1E16]">{p.name}</h3>
                    <span className="font-serif text-lg font-bold text-[#C85A32]">
                      ₹{p.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A4537] mt-1.5 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-[#F2ECE1]/60 border-t border-[#EAE3D9] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleAvailability(p)}
                  className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                    p.available
                      ? 'text-amber-800 hover:text-amber-900'
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  {p.available ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{p.available ? 'Mark Sold Out' : 'Mark Available'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 text-[#735A4C] hover:text-[#2B1E16] hover:bg-white rounded-lg transition-colors"
                    title="Edit Treat"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-white rounded-lg transition-colors"
                    title="Delete Treat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F0] rounded-3xl border border-[#EAE3D9] max-w-lg w-full p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#EAE3D9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#2B1E16] mb-1">
              {editingProduct ? 'Edit Bakery Treat' : 'Add New Treat to Cabinet'}
            </h2>
            <p className="text-xs text-[#735A4C] mb-6">
              Enter product specifications, base starting price, and photography URL.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raspberry Pistachio Tart"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3 py-2.5 text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1">
                  Baker Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the layers, ingredients, and flavor profile..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-[#D9C8B5] rounded-xl p-3 text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availableCheckbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-[#C85A32] rounded focus:ring-[#C85A32]"
                />
                <label htmlFor="availableCheckbox" className="text-xs text-[#2B1E16] font-medium cursor-pointer">
                  Available for customer ordering immediately
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#EAE3D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D9C8B5] text-[#5A4537] hover:bg-[#F2ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34B24] text-white font-medium shadow-sm flex items-center gap-2"
                >
                  {modalSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Add Treat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
