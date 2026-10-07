import fs from 'fs';
import path from 'path';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  createdAt: string;
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

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'BAKING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

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

interface DatabaseSchema {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  nextIds: {
    customer: number;
    product: number;
    order: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bakery-db.json');

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Chocolate Truffle Cake',
    description: 'Layers of rich Dutch cocoa sponge filled with silky dark chocolate ganache and chocolate curls.',
    category: 'Cakes',
    price: 599,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Red Velvet Cake',
    description: 'Velvety crimson sponge layered with our signature Madagascar vanilla cream cheese frosting.',
    category: 'Cakes',
    price: 699,
    imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Black Forest Cake',
    description: 'Classic kirsch-infused cocoa cake layered with sweet sour-cherry compote and fresh whipped cream.',
    category: 'Cakes',
    price: 649,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Vanilla Celebration Cake',
    description: 'Pure Bourbon vanilla bean crumb with whipped buttercream, pastel sprinkles, and edible pearl accents.',
    category: 'Cakes',
    price: 549,
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Chocolate Cupcakes',
    description: 'A box of 6 ultra-moist dark chocolate cupcakes crowned with fudge swirls and golden cocoa nibs.',
    category: 'Cupcakes',
    price: 399,
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Fudge Brownies',
    description: 'Box of 6 crinkly-top artisanal brownies with molten 70% dark chocolate pockets and sea salt.',
    category: 'Brownies',
    price: 349,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Butter Cookies',
    description: 'Golden, melt-in-your-mouth European cultured butter cookies dusted with sparkling demerara sugar.',
    category: 'Cookies',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Custom Celebration Cake',
    description: 'Two-tier artisanal centerpiece custom designed to your chosen palette, personalized piping, and toppers.',
    category: 'Custom Cakes',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
    available: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Lotus Greens, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '9812345678',
    address: 'B-12, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    pincode: '560066',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'SC-8421',
    customerId: 1,
    productId: 1,
    quantity: 1,
    size: '1 kg',
    flavor: 'Belgian Chocolate Truffle',
    theme: 'Golden Elegance',
    cakeMessage: 'Happy 25th Anniversary Mom & Dad',
    eggless: true,
    additionalDecorations: 'Gold Foil + Fresh Strawberries',
    specialInstructions: 'Please make sure delivery happens before 4 PM.',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryTime: '02:00 PM - 04:00 PM',
    deliveryAddress: 'Flat 402, Lotus Greens, Indiranagar, Bengaluru - 560038',
    subtotal: 949,
    customizationCharge: 120,
    deliveryCharge: 50,
    total: 1119,
    status: 'BAKING',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    orderNumber: 'SC-7934',
    customerId: 2,
    productId: 2,
    quantity: 1,
    size: '0.5 kg',
    flavor: 'Classic Red Velvet',
    theme: 'Minimalist Floral',
    cakeMessage: 'Welcome Home Rhea!',
    eggless: false,
    additionalDecorations: 'French Macarons (2 pcs)',
    specialInstructions: 'Ring doorbell twice upon arrival.',
    deliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    deliveryTime: '10:00 AM - 12:00 PM',
    deliveryAddress: 'B-12, Palm Meadows, Whitefield, Bengaluru - 560066',
    subtotal: 699,
    customizationCharge: 80,
    deliveryCharge: 50,
    total: 829,
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading DB file, reinitializing:', e);
    }

    const initial: DatabaseSchema = {
      customers: INITIAL_CUSTOMERS,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      nextIds: {
        customer: 3,
        product: 9,
        order: 3
      }
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const toWrite = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: number): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.data.nextIds.product++,
      createdAt: new Date().toISOString()
    };
    this.data.products.push(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: number, update: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...update,
      id
    };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: number): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    const deleted = this.data.products.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    return this.data.customers;
  }

  getCustomerById(id: number): Customer | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  findCustomerByEmailOrPhone(email: string, phone: string): Customer | undefined {
    return this.data.customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() || c.phone === phone
    );
  }

  createOrUpdateCustomer(custData: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const existing = this.findCustomerByEmailOrPhone(custData.email, custData.phone);
    if (existing) {
      existing.name = custData.name;
      existing.address = custData.address;
      existing.city = custData.city;
      existing.pincode = custData.pincode;
      this.save();
      return existing;
    }

    const newCustomer: Customer = {
      ...custData,
      id: this.data.nextIds.customer++,
      createdAt: new Date().toISOString()
    };
    this.data.customers.push(newCustomer);
    this.save();
    return newCustomer;
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    // Populate customer and product references
    return this.data.orders.map((order) => {
      const customer = this.getCustomerById(order.customerId);
      const product = this.getProductById(order.productId);
      return {
        ...order,
        customer,
        product
      };
    });
  }

  getOrderById(id: number): Order | undefined {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return undefined;
    return {
      ...order,
      customer: this.getCustomerById(order.customerId),
      product: this.getProductById(order.productId)
    };
  }

  getOrderByOrderNumber(orderNumber: string): Order | undefined {
    const cleanNum = orderNumber.trim().toUpperCase();
    const order = this.data.orders.find((o) => o.orderNumber.toUpperCase() === cleanNum);
    if (!order) return undefined;
    return {
      ...order,
      customer: this.getCustomerById(order.customerId),
      product: this.getProductById(order.productId)
    };
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'product'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: this.data.nextIds.order++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);
    this.save();
    return {
      ...newOrder,
      customer: this.getCustomerById(newOrder.customerId),
      product: this.getProductById(newOrder.productId)
    };
  }

  updateOrderStatus(id: number, newStatus: OrderStatus): { success: boolean; order?: Order; message?: string } {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Business rule: Cancelled orders cannot become delivered
    if (order.status === 'CANCELLED' && newStatus === 'DELIVERED') {
      return { success: false, message: 'Cancelled orders cannot be marked as delivered.' };
    }

    // Business rule: Delivered orders cannot be cancelled
    if (order.status === 'DELIVERED' && newStatus === 'CANCELLED') {
      return { success: false, message: 'Delivered orders cannot be cancelled.' };
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    this.save();

    return {
      success: true,
      order: {
        ...order,
        customer: this.getCustomerById(order.customerId),
        product: this.getProductById(order.productId)
      }
    };
  }

  deleteOrder(id: number): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter((o) => o.id !== id);
    const deleted = this.data.orders.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }
}

export const db = new Database();
