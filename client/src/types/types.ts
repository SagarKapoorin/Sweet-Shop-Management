export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type Sweet = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
};

export type SweetPayload = {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
};
