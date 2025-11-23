export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  stock_quantity: number;
  category_id?: number;
  images: string[];
  specifications?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: Address;
  created_at: string;
  updated_at: string;
}

export interface Address {
  province: string;
  city: string;
  district: string;
  street: string;
  postal_code: string;
  is_default: boolean;
}

export interface Order {
  id: number;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: Product;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}