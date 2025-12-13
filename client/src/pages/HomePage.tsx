import axios from "axios";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import { useAuth } from "../context/AuthContext";
import { CloseIcon, LoaderIcon, SearchIcon } from "../assets/icons";
import { type Sweet, type SweetPayload } from "../types/types";

const categories = ["Chocolate", "Candy", "Pastry", "Traditional", "Other"];

const HomePage = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sweet | null>(null);
  const [form, setForm] = useState<SweetPayload>({ name: "", category: "", price: 0, stock: 0, description: "" });
  const [purchaseTarget, setPurchaseTarget] = useState<Sweet | null>(null);
  const [purchaseQty, setPurchaseQty] = useState("1");
  const errorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; error?: string };
      return data?.message || data?.error || err.message;
    }
    return err instanceof Error ? err.message : "Something went wrong";
  };

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm), 400);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedTerm) params.append("name", debouncedTerm);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    const built = params.toString();
    return built ? `?${built}` : "";
  }, [debouncedTerm, category, minPrice, maxPrice]);

  const loadSweets = async () => {
    setFetching(true);
    try {
      const res = query ? await api.get(`/sweets/search${query}`) : await api.get("/sweets");
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
    setPurchaseQty("1");
  };

  const handlePurchaseConfirm = async () => {
    if (!user) {
      toast.error("Login required");
      return;
    }
    if (!purchaseTarget) return;
    const qty = Number(purchaseQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/sweets/${purchaseTarget.id}/purchase`, { quantity: qty });
      toast.success("Purchased");
      setPurchaseTarget(null);
      loadSweets();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      await api.delete(`/sweets/${id}`);
      toast.success("Deleted");
      loadSweets();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const payload: SweetPayload = {
        ...form,
        description: form.description?.trim() ? form.description.trim() : undefined,
      };
      if (editing) {
        await api.put(`/sweets/${editing.id}`, payload);
        toast.success("Sweet updated");
      } else {
        await api.post("/sweets", payload);
        toast.success("Sweet created");
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", category: "", price: 0, stock: 0, description: "" });
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
      description: sweet.description ?? "",
    });
    setShowForm(true);
  };

  const filteredSweets = sweets;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50">
      <Navbar onOpenAdmin={() => setShowForm(true)} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500">Search</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3">
                <SearchIcon />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sweets by Name and Category"
                  className="w-full bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div className="w-full md:w-44">
              <label className="text-xs font-semibold text-slate-500">Category</label>
              <div className="mt-2 flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Other"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 md:w-64">
              <div>
                <label className="text-xs font-semibold text-slate-500">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <button
              onClick={loadSweets}
              className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="mt-8 flex justify-center">
            <LoaderIcon />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                role={user?.role}
                onPurchase={openPurchase}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
            {filteredSweets.length === 0 && <p className="col-span-full text-center text-sm text-slate-500">No sweets found</p>}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{editing ? "Edit Sweet" : "Add Sweet"}</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="text-slate-500 transition hover:text-rose-500"
              >
                <CloseIcon />
              </button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleFormSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-500">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Category</label>
                <div className="mt-1 flex gap-2">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-1/2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="Custom"
                    className="w-1/2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Price</label>
                  <input
                    required
                    min={0}
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Stock</label>
                  <input
                    required
                    min={0}
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Optional details"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading && <LoaderIcon />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {purchaseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Purchase {purchaseTarget.name}</h3>
              <button onClick={() => setPurchaseTarget(null)} className="text-slate-500 transition hover:text-rose-500">
                <CloseIcon />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPurchaseTarget(null)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handlePurchaseConfirm}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading && <LoaderIcon />}
                  Confirm
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
