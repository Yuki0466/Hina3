import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { CartItem } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export function Cart() {
  const { user } = useAuth()
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart(user?.id)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('确定要清空购物车吗？')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Failed to clear cart:', error)
      }
    }
  }

  const handleCheckout = () => {
    // Navigate to checkout page (to be implemented)
    navigate('/checkout')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <Link to="/auth" className="btn btn-primary">
            去登录
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const shipping = totalPrice >= 99 ? 0 : 10

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              返回
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              购物车 ({totalItems})
            </h1>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              清空购物车
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h2>
            <p className="text-gray-600 mb-8">快去挑选您喜欢的商品吧！</p>
            <Link to="/" className="btn btn-primary">
              去购物
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <Link to={`/product/${item.product_id}`}>
                      <img
                        src={item.product?.images[0] || '/images/placeholder.jpg'}
                        alt={item.product?.name || '商品'}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product_id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      
                      {item.product?.specifications && (
                        <div className="text-sm text-gray-500 mt-1">
                          {Object.entries(item.product.specifications).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {Array.isArray(value) ? value[0] : value}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          {item.product?.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ¥{item.product.original_price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-lg font-bold text-primary-600">
                            ¥{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ¥{(item.product?.price || 0).toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-center min-w-[3rem]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.product && item.quantity >= item.product.stock_quantity}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.product && item.product.stock_quantity <= 10 && item.product.stock_quantity > 0 && (
                    <div className="mt-3 text-sm text-orange-600">
                      仅剩 {item.product.stock_quantity} 件库存
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">订单摘要</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>商品小计 ({totalItems} 件)</span>
                    <span>¥{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>运费</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">免运费</span>
                      ) : (
                        `¥${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {totalPrice < 99 && (
                    <div className="text-sm text-orange-600">
                      再买 ¥{(99 - totalPrice).toFixed(2)} 即可免运费
                    </div>
                  )}

                  {totalPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>优惠</span>
                      <span>-¥0.00</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>总计</span>
                      <span>¥{(totalPrice + shipping).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn btn-primary py-3 text-lg font-medium"
                  >
                    结算 ({totalItems})
                  </button>
                  
                  <Link
                    to="/"
                    className="block w-full btn btn-outline text-center"
                  >
                    继续购物
                  </Link>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>7天无理由退换货</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>满99元包邮</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>正品保证</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}