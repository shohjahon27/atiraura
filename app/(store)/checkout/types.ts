// app/(store)/checkout/types.ts

export type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};