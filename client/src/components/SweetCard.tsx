import { BagIcon, DeleteIcon, EditIcon } from "../assets/icons";
import { type Sweet } from "../types/types";

type SweetCardProps = {
  sweet: Sweet;
  role?: "user" | "admin" | null;
  onPurchase: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
};

const SweetCard = ({ sweet, role, onPurchase, onEdit, onDelete }: SweetCardProps) => {
  const out = sweet.stock === 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{sweet.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{sweet.name}</h3>
          {sweet.description && (
            <p className="mt-1 max-h-12 overflow-hidden text-sm text-slate-600">{sweet.description}</p>
          )}
        </div>
        {out && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">Out of Stock</span>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Price</p>
          <p className="text-xl font-bold text-indigo-600">${sweet.price.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-500">Stock: {sweet.stock}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            disabled={out}
            onClick={() => onPurchase(sweet)}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
              out ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <BagIcon />
            Purchase
          </button>
          {role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(sweet)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete?.(sweet.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
              >
                <DeleteIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
