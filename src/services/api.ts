import { supabase } from './supabase'
import { Product, Category, Profile, Order, CartItem, ApiResponse } from '@/types'
import { mockProducts, mockCategories } from '@/data/mockData'

// 检查是否有有效的 Supabase 配置
const hasValidSupabaseConfig = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         !import.meta.env.VITE_SUPABASE_URL.includes('your-project') &&
         !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-supabase')
}

export const apiService = {
  // 商品相关
  async getProducts(categoryId?: number): Promise<Product[]> {
    // 如果没有有效的 Supabase 配置，返回模拟数据
    if (!hasValidSupabaseConfig()) {
      console.log('使用模拟数据 (未配置 Supabase)')
      return categoryId 
        ? mockProducts.filter(p => p.category_id === categoryId)
        : mockProducts
    }

    try {
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
    } catch (error) {
      console.error('获取商品失败，使用模拟数据:', error)
      return categoryId 
        ? mockProducts.filter(p => p.category_id === categoryId)
        : mockProducts
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    // 如果没有有效的 Supabase 配置，返回模拟数据
    if (!hasValidSupabaseConfig()) {
      console.log('使用模拟商品详情 (未配置 Supabase)')
      return mockProducts.find(p => p.id === id) || null
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('获取商品详情失败，使用模拟数据:', error)
      return mockProducts.find(p => p.id === id) || null
    }
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
    // 如果没有有效的 Supabase 配置，返回模拟数据
    if (!hasValidSupabaseConfig()) {
      console.log('使用模拟分类数据 (未配置 Supabase)')
      return mockCategories
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取分类失败，使用模拟数据:', error)
      return mockCategories
    }
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

  // 购物车相关 (离线模式暂时不支持，返回空数据)
  async getCartItems(userId: string): Promise<CartItem[]> {
    if (!hasValidSupabaseConfig()) {
      console.log('购物车功能需要 Supabase 配置')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取购物车失败:', error)
      return []
    }
  },

  async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {
    if (!hasValidSupabaseConfig()) {
      throw new Error('购物车功能需要 Supabase 配置')
    }

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
    if (!hasValidSupabaseConfig()) {
      throw new Error('购物车功能需要 Supabase 配置')
    }

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
    if (!hasValidSupabaseConfig()) {
      throw new Error('购物车功能需要 Supabase 配置')
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async clearCart(userId: string): Promise<void> {
    if (!hasValidSupabaseConfig()) {
      throw new Error('购物车功能需要 Supabase 配置')
    }

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