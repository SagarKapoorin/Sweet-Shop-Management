import { BagIcon, DeleteIcon, EditIcon } from '../assets/icons';
import { type Sweet } from '../types/types';

type SweetCardProps = {
  sweet: Sweet;
  role?: 'user' | 'admin' | null;
  onPurchase: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
};

const SweetCard = ({ sweet, role, onPurchase, onEdit, onDelete }: SweetCardProps) => {
  const out = sweet.stock === 0;
  const lowStock = sweet.stock > 0 && sweet.stock <= 5;

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-stone-200 bg-gradient-to-br from-white via-amber-50/20 to-rose-50/20 p-5 shadow-lg shadow-stone-200/50 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-200/50">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/30 to-rose-200/30 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80" />

      <div className="absolute left-4 top-4 h-6 w-6 rounded-full bg-amber-300/20 transition-all duration-500 group-hover:scale-150 group-hover:bg-amber-400/40" />
      <div className="absolute bottom-8 right-8 h-8 w-8 rounded-full bg-rose-300/20 transition-all duration-500 group-hover:scale-125 group-hover:bg-rose-400/40" />

      <div className="shimmer absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 px-3 py-1 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {sweet.category}
              </span>
            </div>
            <h3 className="text-xl font-bold leading-tight text-stone-900 transition-all duration-300 group-hover:scale-105 group-hover:text-rose-600">
              {sweet.name}
            </h3>
            {sweet.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
                {sweet.description}
              </p>
            )}
          </div>
          {out && (
            <span className="flex h-fit items-center gap-1 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-200/50">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Out of Stock
            </span>
          )}
          {!out && lowStock && (
            <span className="flex h-fit items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-amber-200/50">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Low Stock
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-stone-200 pt-4">
          <div className="flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
              Price
            </p>
            <div className="relative">
              <p className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-3xl font-black leading-none text-transparent transition-all duration-300 group-hover:scale-110">
                ${sweet.price.toFixed(2)}
              </p>
              <div className="absolute -inset-2 -z-10 rounded-lg bg-gradient-to-r from-rose-200/30 to-amber-200/30 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`h-2 w-2 animate-pulse rounded-full ${out ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-emerald-500'}`}
              />
              <p className="text-xs font-semibold text-stone-600">
                {sweet.stock} {sweet.stock === 1 ? 'item' : 'items'} available
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              disabled={out}
              onClick={() => onPurchase(sweet)}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg transition-all ${
                out
                  ? 'cursor-not-allowed bg-stone-300 text-stone-500'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-rose-200/50 hover:scale-105 hover:shadow-xl hover:shadow-rose-300/50'
              }`}
            >
              <BagIcon />
              <span className="hidden sm:inline">Purchase</span>
            </button>
            {role === 'admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(sweet)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-stone-200 bg-white text-stone-700 shadow-sm transition-all hover:scale-105 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-200/50"
                  aria-label="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => onDelete?.(sweet.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-stone-200 bg-white text-stone-700 shadow-sm transition-all hover:scale-105 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 hover:shadow-lg hover:shadow-rose-200/50"
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
