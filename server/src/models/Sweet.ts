import { Schema, model, Document, Model } from 'mongoose';

export interface SweetAttributes {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

export interface SweetDocument extends SweetAttributes, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sweetSchema = new Schema<SweetDocument, Model<SweetDocument>>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: false, trim: true }
  },
  { timestamps: true }
);

sweetSchema.index(
  { name: 'text', category: 'text', description: 'text' },
  { weights: { name: 5, category: 2, description: 1 } }
);

const Sweet = model<SweetDocument>('Sweet', sweetSchema);

export default Sweet;
