import { Product, Order, Customer, OrderCreatePayload, OrderStatus, AdminStats } from '../types/bakery.ts';

const BASE_URL = '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status);
  }

  return data as T;
}

export const api = {
  // --- PRODUCTS ---
  getProducts: () => request<Product[]>('/products'),
  getProductById: (id: number) => request<Product>(`/products/${id}`),
  createProduct: (data: Omit<Product, 'id' | 'createdAt'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateProduct: (id: number, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteProduct: (id: number) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE'
    }),

  // --- ORDERS ---
  getOrders: () => request<Order[]>('/orders'),
  getOrderById: (id: number) => request<Order>(`/orders/${id}`),
  trackOrder: (orderNumber: string) =>
    request<Order>(`/orders/track/${encodeURIComponent(orderNumber.trim())}`),
  createOrder: (payload: OrderCreatePayload) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateOrderStatus: (id: number, status: OrderStatus) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  deleteOrder: (id: number) =>
    request<{ success: boolean; message: string }>(`/orders/${id}`, {
      method: 'DELETE'
    }),

  // --- CUSTOMERS ---
  getCustomers: () => request<Customer[]>('/customers'),
  getCustomerById: (id: number) => request<Customer>(`/customers/${id}`),

  // --- ADMIN ---
  adminLogin: (credentials: { username: string; password: string }) =>
    request<{ success: boolean; token: string; user: { name: string; email: string; role: string } }>(
      '/admin/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      }
    ),
  getAdminStats: () => request<AdminStats>('/admin/stats')
};
