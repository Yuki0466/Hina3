import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, TagIcon, FireIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ProductCard } from '@/components/ProductCard'
import { DataInitializer } from '@/components/DataInitializer'
import { Product, Category } from '@/types'
import { apiService } from '@/services/api'

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBanner, setCurrentBanner] = useState(0)

  const banners = [
    {
      id: 1,
      title: '新品上市',
      subtitle: '探索最新科技产品',
      image: '/images/banner1.jpg',
      bgColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    },
    {
      id: 2,
      title: '限时优惠',
      subtitle: '精选商品特价促销',
      image: '/images/banner2.jpg',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    },
    {
      id: 3,
      title: '品质生活',
      subtitle: '打造理想家居环境',
      image: '/images/banner3.jpg',
      bgColor: 'bg-gradient-to-r from-green-500 to-teal-600',
    },
  ]

  const loadData = async () => {
    try {
      console.log('开始加载首页数据...')
      
      const [products, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ])
      
      console.log('加载到的数据:', { products: products.length, categories: categoriesData.length })
      
      // 分为新品和推荐商品
      const newProd = products.slice(0, 8)
      const featuredProd = products.filter(p => p.original_price && p.original_price > p.price).slice(0, 8)
      
      setNewProducts(newProd)
      setFeaturedProducts(featuredProd.length > 0 ? featuredProd : products.slice(0, 8))
      setCategories(categoriesData)
      
      console.log('设置状态完成:', { 
        newProductsCount: newProd.length, 
        featuredProductsCount: featuredProd.length > 0 ? featuredProd.length : products.slice(0, 8).length,
        categoriesCount: categoriesData.length
      })
    } catch (error) {
      console.error('Error loading home data:', error)
      // 即使出错也要显示一些内容
      setNewProducts([])
      setFeaturedProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Refresh Button */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="刷新数据"
        >
          <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Banner Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`h-full ${banner.bgColor} flex items-center`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="text-center text-white">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {banner.title}
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 animate-slide-up">
                      {banner.subtitle}
                    </p>
                    <button className="btn bg-white text-gray-900 hover:bg-gray-100 btn-lg">
                      立即购买
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Banner Controls */}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Next banner"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Banner Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">商品分类</h2>
            <p className="mt-2 text-gray-600">探索不同类型的商品</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group text-center"
                >
                  <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <TagIcon className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">暂无商品分类</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FireIcon className="h-8 w-8 text-orange-500 mr-2" />
                热门商品
              </h2>
              <p className="mt-2 text-gray-600">精选优质商品，限时优惠</p>
            </div>
            <Link
              to="/products?sort=featured"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看更多 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">暂无热门商品</p>
                <Link to="/" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  返回首页
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">新品上市</h2>
              <p className="mt-2 text-gray-600">最新上架的商品</p>
            </div>
            <Link
              to="/products?sort=new"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看更多 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">暂无新品</p>
                <Link to="/" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  返回首页
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            订阅我们的优惠信息
          </h2>
          <p className="text-primary-100 mb-8">
            第一时间获取最新商品和独家优惠
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="请输入您的邮箱地址"
              className="flex-1 max-w-md px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="submit"
              className="btn bg-white text-primary-600 hover:bg-gray-100 font-medium"
            >
              立即订阅
            </button>
          </form>
        </div>
      </section>

      {/* Data Initializer - 只在开发环境显示 */}
      {import.meta.env.DEV && <DataInitializer />}
    </div>
  )
}