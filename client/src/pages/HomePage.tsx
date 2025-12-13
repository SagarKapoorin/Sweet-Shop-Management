import axios from 'axios';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SweetCard from '../components/SweetCard';
import { useAuth } from '../context/AuthContext';
import { CloseIcon, LoaderIcon, SearchIcon } from '../assets/icons';
import { type Sweet, type SweetPayload } from '../types/types';
import { Sparkle, CupcakeIcon, LollipopIcon, DonutPattern } from '../components/Decorations';

const categories = ['Chocolate', 'Candy', 'Pastry', 'Traditional', 'Other'];

const HomePage = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sweet | null>(null);
  const [form, setForm] = useState<SweetPayload>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
  });
  const [purchaseTarget, setPurchaseTarget] = useState<Sweet | null>(null);
  const [purchaseQty, setPurchaseQty] = useState('1');
  const errorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; error?: string };
      return data?.message || data?.error || err.message;
    }
    return err instanceof Error ? err.message : 'Something went wrong';
  };

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm), 400);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedTerm) params.append('name', debouncedTerm);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    const built = params.toString();
    return built ? `?${built}` : '';
  }, [debouncedTerm, category, minPrice, maxPrice]);

  const loadSweets = async () => {
    setFetching(true);
    try {
      const res = query ? await api.get(`/sweets/search${query}`) : await api.get('/sweets');
      setSweets(res.data);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, [query]);

  const openPurchase = (sweet: Sweet) => {
    setPurchaseTarget(sweet);
    setPurchaseQty('1');
  };

  const handlePurchaseConfirm = async () => {
    if (!user) {
      toast.error('Login required');
      return;
    }
    if (!purchaseTarget) return;
    const qty = Number(purchaseQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/sweets/${purchaseTarget.id}/purchase`, { quantity: qty });
      toast.success('Purchased');
      setPurchaseTarget(null);
      loadSweets();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      await api.delete(`/sweets/${id}`);
      toast.success('Deleted');
      loadSweets();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const payload: SweetPayload = {
        ...form,
        description: form.description?.trim() ? form.description.trim() : undefined,
      };
      if (editing) {
        await api.put(`/sweets/${editing.id}`, payload);
        toast.success('Sweet updated');
      } else {
        await api.post('/sweets', payload);
        toast.success('Sweet created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', category: '', price: 0, stock: 0, description: '' });
      loadSweets();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (sweet: Sweet) => {
    setEditing(sweet);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      stock: sweet.stock,
      description: sweet.description ?? '',
    });
    setShowForm(true);
  };

  const filteredSweets = sweets;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <DonutPattern />
      <Navbar onOpenAdmin={() => setShowForm(true)} />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 px-8 py-12 text-center shadow-2xl">
          <div className="absolute left-10 top-10 opacity-20">
            <CupcakeIcon className="h-16 w-16 text-rose-400" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <LollipopIcon className="h-16 w-16 text-amber-400" />
          </div>

          <Sparkle delay="0s" left="15%" top="20%" />
          <Sparkle delay="1s" left="85%" top="30%" />
          <Sparkle delay="2s" left="50%" top="10%" />
          <Sparkle delay="1.5s" left="25%" top="70%" />
          <Sparkle delay="0.5s" left="75%" top="60%" />

          <div className="relative animate-bounce-in">
            <h1 className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-4xl font-black text-transparent sm:text-6xl">
              Discover Sweet Delights
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-stone-700 sm:text-lg">
              Indulge in our handcrafted collection of premium sweets, treats, and confections
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-stone-700">Fresh Daily</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-stone-700">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                <span className="text-sm font-semibold text-stone-700">Artisan Made</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border-2 border-stone-200 bg-white shadow-xl shadow-stone-200/50 transition-all duration-300 hover:shadow-2xl">
          <div className="border-b-2 border-stone-100 bg-gradient-to-r from-amber-50 via-white to-rose-50 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <div className="rounded-lg bg-gradient-to-br from-rose-400 to-amber-400 p-2 shadow-lg">
                <SearchIcon />
              </div>
              Filter & Search
            </h2>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Search
                </label>
                <div className="flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 transition-all focus-within:border-amber-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber-200/50">
                  <SearchIcon />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sweets by name or category..."
                    className="w-full bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Custom Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Type custom..."
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="999"
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                />
              </div>

              <div className="flex items-end sm:col-span-2">
                <button
                  onClick={loadSweets}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-300/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center gap-2">
                    <SearchIcon />
                    Apply Filters
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {fetching ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <LoaderIcon />
              <p className="mt-4 text-sm font-semibold text-stone-600">
                Loading delicious treats...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold text-stone-600">
                {filteredSweets.length} {filteredSweets.length === 1 ? 'sweet' : 'sweets'} found
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSweets.map((sweet, index) => (
                <div
                  key={sweet.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <SweetCard
                    sweet={sweet}
                    role={user?.role}
                    onPurchase={openPurchase}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
            {filteredSweets.length === 0 && (
              <div className="animate-fade-in flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-gradient-to-br from-stone-50 to-amber-50/30 p-12 text-center">
                <div className="mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 shadow-lg">
                  <SearchIcon />
                </div>
                <h3 className="mb-2 bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
                  No sweets found
                </h3>
                <p className="text-sm font-medium text-stone-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl animate-in fade-in zoom-in overflow-hidden rounded-3xl border-2 border-stone-200 bg-white shadow-2xl">
            <div className="border-b-2 border-stone-100 bg-gradient-to-r from-amber-50 via-white to-rose-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">
                    {editing ? 'Edit Sweet' : 'Add New Sweet'}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {editing
                      ? 'Update sweet information'
                      : 'Add a delicious new treat to your shop'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-all hover:bg-rose-100 hover:text-rose-600"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <form className="p-6" onSubmit={handleFormSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                    Sweet Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Chocolate Truffle"
                    className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                      Custom Category
                    </label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      placeholder="or type custom"
                      required
                      className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                      Price ($)
                    </label>
                    <input
                      required
                      min={0}
                      step="0.01"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                      placeholder="0.00"
                      className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                      Stock
                    </label>
                    <input
                      required
                      min={0}
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                    Description (Optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe your sweet..."
                    rows={4}
                    className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t-2 border-stone-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="rounded-xl border-2 border-stone-200 px-6 py-3 text-sm font-bold text-stone-700 transition-all hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-300/50 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading && <LoaderIcon />}
                  {editing ? 'Update Sweet' : 'Create Sweet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {purchaseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in overflow-hidden rounded-3xl border-2 border-stone-200 bg-white shadow-2xl">
            <div className="border-b-2 border-stone-100 bg-gradient-to-r from-amber-50 via-white to-rose-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Purchase {purchaseTarget.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">Select quantity to purchase</p>
                </div>
                <button
                  onClick={() => setPurchaseTarget(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-all hover:bg-rose-100 hover:text-rose-600"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-700">Price per item</span>
                  <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-2xl font-black text-transparent">
                    ${purchaseTarget.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">Available stock</span>
                  <span className="text-xs font-bold text-emerald-600">
                    {purchaseTarget.stock} items
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={purchaseTarget.stock}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-center text-2xl font-bold text-stone-900 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                />
              </div>

              {Number(purchaseQty) > 0 && (
                <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-700">Total Amount</span>
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-black text-transparent">
                      ${(purchaseTarget.price * Number(purchaseQty)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t-2 border-stone-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setPurchaseTarget(null)}
                  className="flex-1 rounded-xl border-2 border-stone-200 px-6 py-3 text-sm font-bold text-stone-700 transition-all hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handlePurchaseConfirm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-300/50 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading && <LoaderIcon />}
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
