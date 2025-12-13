import { z } from 'zod';

const priceNumber = z.coerce
  .number()
  .min(0)
  .refine((value) => !Number.isNaN(value));

export const createSweetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: priceNumber,
  stock: z.coerce.number().int().min(0),
  description: z.string().min(1).optional()
});

export type CreateSweetInput = z.infer<typeof createSweetSchema>;

export const updateSweetSchema = z
  .object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    price: priceNumber.optional(),
    stock: z.coerce.number().int().min(0).optional(),
    description: z.string().min(1).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  });

export type UpdateSweetInput = z.infer<typeof updateSweetSchema>;

export const purchaseSchema = z.object({
  quantity: z.coerce.number().int().min(1)
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;

export const restockSchema = z.object({
  quantity: z.coerce.number().int().min(1)
});

export type RestockInput = z.infer<typeof restockSchema>;

export const searchSchema = z
  .object({
    name: z.string().optional(),
    category: z.string().optional(),
    minPrice: priceNumber.optional(),
    maxPrice: priceNumber.optional()
  })
  .refine(
    (value) => {
      if (value.minPrice !== undefined && value.maxPrice !== undefined) {
        return value.minPrice <= value.maxPrice;
      }
      return true;
    },
    { message: 'minPrice cannot exceed maxPrice' }
  );

export type SearchInput = z.infer<typeof searchSchema>;
