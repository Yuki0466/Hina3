import { supabase } from './supabase'
import { Product, Category, Profile, Order, CartItem, ApiResponse } from '@/types'

export const apiService = {
  // 商品相关
  async getProducts(categoryId?: number): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async searchProducts(keyword: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // 分类相关
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // 用户相关
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 购物车相关
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity,
      }, {
        onConflict: 'user_id,product_id',
        ignoreDuplicates: false
      })
      .select('*, product:products(*)')
      .single()

    if (error) throw error
    return data
  },

  async updateCartItem(userId: string, cartItemId: number, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .select('*, product:products(*)')
      .single()

    if (error) throw error
    return data
  },

  async removeFromCart(userId: string, cartItemId: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  },

  // 订单相关
  async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createOrder(userId: string, orderData: Omit<Order, 'id' | 'user_id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: userId,
        order_number: orderNumber,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}