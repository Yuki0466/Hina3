import { useState, useEffect, useCallback } from 'react'
import { CartItem, Product } from '@/types'
import { apiService } from '@/services/api'

export function useCart(userId: string | undefined) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadCartItems = useCallback(async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const items = await apiService.getCartItems(userId)
      setCartItems(items)
    } catch (error) {
      console.error('Error loading cart items:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadCartItems()
  }, [loadCartItems])

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const newItem = await apiService.addToCart(userId, productId, quantity)
      setCartItems(prev => {
        const existingIndex = prev.findIndex(item => item.product_id === productId)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = newItem
          return updated
        }
        return [...prev, newItem]
      })
      return newItem
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      const updatedItem = await apiService.updateCartItem(userId, cartItemId, quantity)
      setCartItems(prev =>
        prev.map(item => item.id === cartItemId ? updatedItem : item)
      )
      return updatedItem
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await apiService.removeFromCart(userId, cartItemId)
      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await apiService.clearCart(userId)
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.product_id === productId)
  }

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    refreshCart: loadCartItems,
  }
}