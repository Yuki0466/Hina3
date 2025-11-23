import { useState } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/services/supabase'

export function DataInitializer() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const initializeData = async () => {
    setLoading(true)
    setMessage('')

    try {
      // 添加示例分类
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .upsert([
          { name: '电子产品', description: '各类电子设备和数码产品' },
          { name: '服装配饰', description: '时尚服装和配饰' },
          { name: '家居用品', description: '居家生活用品' },
          { name: '运动户外', description: '运动器材和户外装备' },
        ], {
          onConflict: 'name'
        })
        .select()

      if (catError) throw catError

      // 添加示例商品
      const sampleProducts = [
        {
          name: 'iPhone 15 Pro',
          description: '苹果最新款智能手机，钛金属设计',
          price: 8999.00,
          original_price: 9999.00,
          sku: 'IP15P001',
          stock_quantity: 50,
          category_id: categories?.[0]?.id || 1,
          images: ['https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=iPhone+15+Pro'],
          specifications: { color: ['深空黑', '银色', '金色'], storage: ['128GB', '256GB'] },
          is_active: true
        },
        {
          name: '运动T恤',
          description: '透气速干运动T恤',
          price: 199.00,
          original_price: 299.00,
          sku: 'SPORT001',
          stock_quantity: 100,
          category_id: categories?.[1]?.id || 2,
          images: ['https://via.placeholder.com/400x400/10B981/FFFFFF?text=运动T恤'],
          specifications: { color: ['黑色', '白色', '蓝色'], size: ['S', 'M', 'L', 'XL'] },
          is_active: true
        },
        {
          name: '智能手表',
          description: '多功能运动健康智能手表',
          price: 1299.00,
          original_price: 1599.00,
          sku: 'WATCH001',
          stock_quantity: 30,
          category_id: categories?.[0]?.id || 1,
          images: ['https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=智能手表'],
          specifications: { color: ['黑色', '银色'], screen: '1.4英寸AMOLED' },
          is_active: true
        },
        {
          name: '瑜伽垫',
          description: '防滑加厚瑜伽垫',
          price: 99.00,
          original_price: 149.00,
          sku: 'YOGA001',
          stock_quantity: 200,
          category_id: categories?.[3]?.id || 4,
          images: ['https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=瑜伽垫'],
          specifications: { thickness: '6mm', material: 'TPE' },
          is_active: true
        },
      ]

      const { data: products, error: prodError } = await supabase
        .from('products')
        .upsert(sampleProducts, {
          onConflict: 'sku'
        })
        .select()

      if (prodError) throw prodError

      setMessage(`成功添加 ${categories?.length || 0} 个分类和 ${products?.length || 0} 个商品！`)
      
      // 3秒后刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 3000)

    } catch (error) {
      console.error('初始化数据失败:', error)
      setMessage('初始化数据失败，请检查控制台')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-medium text-gray-900 mb-2">数据初始化</h3>
        <p className="text-sm text-gray-600 mb-3">
          如果首页没有显示商品，点击下方按钮添加示例数据
        </p>
        <button
          onClick={initializeData}
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
          )}
          {loading ? '初始化中...' : '初始化示例数据'}
        </button>
        
        {message && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}