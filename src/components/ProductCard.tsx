import { Link } from 'react-router-dom'
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Product } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const { addToCart, isInCart } = useCart(user?.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      window.location.href = '/auth'
      return
    }
    try {
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const rating = 4.5 // Mock rating - in real app, this would come from reviews

  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            aria-label="Add to wishlist"
          >
            <HeartIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-md font-medium">
              缺货
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIconSolid
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-500">({rating})</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through mr-2">
                ¥{product.original_price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary-600">
              ¥{product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isInCart(product.id)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              product.stock_quantity === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isInCart(product.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {product.stock_quantity === 0
              ? '缺货'
              : isInCart(product.id)
              ? '已加购'
              : '加购'
            }
          </button>
        </div>

        {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
          <p className="text-xs text-orange-600 mt-2">
            仅剩 {product.stock_quantity} 件
          </p>
        )}
      </div>
    </Link>
  )
}