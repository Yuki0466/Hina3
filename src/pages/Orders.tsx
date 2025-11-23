import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingBagIcon, 
  ArrowRightIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Order } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { apiService } from '@/services/api'

export function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return
      
      try {
        const ordersData = await apiService.getOrders(user.id)
        setOrders(ordersData)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: '待付款',
          color: 'text-yellow-600 bg-yellow-100',
          icon: ClockIcon,
        }
      case 'confirmed':
        return {
          label: '待发货',
          color: 'text-blue-600 bg-blue-100',
          icon: ClockIcon,
        }
      case 'shipped':
        return {
          label: '已发货',
          color: 'text-purple-600 bg-purple-100',
          icon: TruckIcon,
        }
      case 'delivered':
        return {
          label: '已完成',
          color: 'text-green-600 bg-green-100',
          icon: CheckCircleIcon,
        }
      case 'cancelled':
        return {
          label: '已取消',
          color: 'text-red-600 bg-red-100',
          icon: XCircleIcon,
        }
      default:
        return {
          label: '未知状态',
          color: 'text-gray-600 bg-gray-100',
          icon: ClockIcon,
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filterOptions = [
    { value: 'all', label: '全部订单' },
    { value: 'pending', label: '待付款' },
    { value: 'confirmed', label: '待发货' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
          <p className="mt-2 text-gray-600">查看和管理您的订单</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === option.value
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? '您还没有订单' : `没有${filterOptions.find(opt => opt.value === filter)?.label}`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? '快去选购您喜欢的商品吧！' : '切换到其他订单状态查看'}
            </p>
            {filter === 'all' && (
              <Link to="/" className="btn btn-primary">
                去购物
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">订单号: {order.order_number}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          下单时间: {formatDate(order.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ¥{order.total_amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            共 {order.items?.length || 0} 件商品
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <Link to={`/product/${item.product_id}`}>
                            <img
                              src={item.product_snapshot.images?.[0] || '/images/placeholder.jpg'}
                              alt={item.product_snapshot.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </Link>
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product_id}`}
                              className="text-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                            >
                              {item.product_snapshot.name}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.quantity} 件 × ¥{item.unit_price.toFixed(2)} = ¥{item.total_price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        收货地址: {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.province}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {order.status === 'pending' && (
                          <>
                            <button className="btn btn-outline">
                              取消订单
                            </button>
                            <button className="btn btn-primary">
                              立即付款
                            </button>
                          </>
                        )}
                        
                        {(order.status === 'confirmed' || order.status === 'shipped') && (
                          <button className="btn btn-outline">
                            查看详情
                          </button>
                        )}
                        
                        {order.status === 'delivered' && (
                          <>
                            <button className="btn btn-outline">
                              查看详情
                            </button>
                            <button className="btn btn-primary">
                              评价商品
                            </button>
                          </>
                        )}
                        
                        {order.status === 'cancelled' && (
                          <button className="btn btn-outline">
                            重新购买
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}