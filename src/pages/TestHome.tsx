import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'

// 硬编码的测试数据
const testProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '苹果最新款智能手机',
    price: 8999,
    original_price: 9999,
    sku: 'IP15P001',
    stock_quantity: 50,
    images: ['https://picsum.photos/400/400?random=1'],
    is_active: true,
  },
  {
    id: 2,
    name: '运动T恤',
    description: '透气速干运动T恤',
    price: 199,
    original_price: 299,
    sku: 'SPORT001',
    stock_quantity: 100,
    images: ['https://picsum.photos/400/400?random=2'],
    is_active: true,
  },
  {
    id: 3,
    name: '智能手表',
    description: '多功能运动健康智能手表',
    price: 1299,
    original_price: 1599,
    sku: 'WATCH001',
    stock_quantity: 30,
    images: ['https://picsum.photos/400/400?random=3'],
    is_active: true,
  },
  {
    id: 4,
    name: '瑜伽垫',
    description: '防滑加厚瑜伽垫',
    price: 99,
    original_price: 149,
    sku: 'YOGA001',
    stock_quantity: 200,
    images: ['https://picsum.photos/400/400?random=4'],
    is_active: true,
  },
]

export function TestHome() {
  const [mounted, setMounted] = useState(false)

  useState(() => {
    console.log('TestHome 组件已加载')
    console.log('测试产品数据:', testProducts)
    setMounted(true)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">测试商品展示</h1>
        
        <div className="mb-8 text-center">
          <p className="text-lg">如果您能看到这些商品，说明基本功能正常</p>
          <p className="text-sm text-gray-600 mt-2">共 {testProducts.length} 个测试商品</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('图片加载失败:', product.images[0])
                    e.currentTarget.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=图片加载失败'
                  }}
                  onLoad={() => console.log('图片加载成功:', product.images[0])}
                />
              </div>
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through mr-2">
                      ¥{product.original_price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-blue-600">
                    ¥{product.price.toFixed(2)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  库存: {product.stock_quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {!mounted && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">组件正在挂载中...</p>
          </div>
        )}
      </div>
    </div>
  )
}