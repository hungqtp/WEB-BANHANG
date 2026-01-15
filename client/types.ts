
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PACKING = 'PACKING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Size M", "Red"
  stock: number;
  priceDelta: number; // Adjustment to base price
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  stock: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestId?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingInfo: ShippingInfo;
  paymentMethod: 'COD' | 'TRANSFER' | 'ONLINE';
  createdAt: string;
}
