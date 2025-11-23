import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { StarIcon, HeartIcon, ShareIcon, MinusIcon, PlusIcon, TruckIcon, ShieldCheckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Product } from '@/types'
import { apiService } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const { user } = useAuth()
  const { addToCart, isInCart } = useCart(user?.id)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      
      try {
        const productData = await apiService.getProductById(parseInt(id))
        setProduct(productData)
        
        // Load related products from same category
        if (productData?.category_id) {
          const related = await apiService.getProducts(productData.category_id)
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4))
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product || !user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth'
      return
    }

    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (product && newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity)
    }
  }

  const rating = 4.5 // Mock rating
  const reviewCount = 128 // Mock review count

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品未找到</h1>
          <Link to="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                首页
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                to={`/category/${product.category_id}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {product.category?.name || '商品分类'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating} ({reviewCount} 评价)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    ¥{product.original_price.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary-600">
                  ¥{product.price.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    省 ¥{(product.original_price! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span>有货 (库存: {product.stock_quantity})</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span>暂时缺货</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-700 mb-6">
                <p>{product.description}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val >= 1 && val <= product.stock_quantity) {
                        setQuantity(val)
                      }
                    }}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || !user || isInCart(product.id)}
                  className={`flex-1 btn py-3 ${
                    product.stock_quantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : !user
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : isInCart(product.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {!user
                    ? '请先登录'
                    : isInCart(product.id)
                    ? '已在购物车'
                    : product.stock_quantity === 0
                    ? '缺货'
                    : '加入购物车'
                  }
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <HeartIcon className="h-5 w-5" />
                  <span>收藏</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <ShareIcon className="h-5 w-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <TruckIcon className="h-5 w-5 mr-3 text-primary-600" />
                <span>免费配送，满99元包邮</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ShieldCheckIcon className="h-5 w-5 mr-3 text-primary-600" />
                <span>7天无理由退换货</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ArrowUturnLeftIcon className="h-5 w-5 mr-3 text-primary-600" />
                <span>正品保证，假一赔十</span>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">商品规格</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="text-gray-600 mr-2">{key}:</dt>
                      <dd className="text-gray-900">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">相关商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="product-card">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={relatedProduct.images[0] || '/images/placeholder.jpg'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600">
                          {relatedProduct.name}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">
                            ¥{relatedProduct.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}