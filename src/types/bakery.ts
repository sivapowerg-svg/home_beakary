export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'BAKING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  createdAt: string;
  orderCount?: number;
  latestOrderDate?: string | null;
  latestOrderNumber?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer?: Customer;
  productId: number;
  product?: Product;
  quantity: number;
  size: string;
  flavor: string;
  theme: string;
  cakeMessage: string;
  eggless: boolean;
  additionalDecorations: string;
  specialInstructions: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  subtotal: number;
  customizationCharge: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreatePayload {
  productId: number;
  quantity: number;
  size: string;
  flavor: string;
  theme: string;
  cakeMessage: string;
  eggless: boolean;
  additionalDecorations: string;
  specialInstructions: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  bakingOrders: number;
  outForDelivery: number;
  completedOrders: number;
  confirmedOrders: number;
  readyOrders: number;
  revenue: number;
  totalProducts: number;
  totalCustomers: number;
}
