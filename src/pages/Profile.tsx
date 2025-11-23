import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  MapPinIcon, 
  CreditCardIcon, 
  Cog6ToothIcon,
  ArrowRightIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { Address } from '@/types'

export function Profile() {
  const { user, profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: {} as Address,
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || {
          province: '',
          city: '',
          district: '',
          street: '',
          postal_code: '',
          is_default: false,
        },
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = () => {
    // Handle avatar upload
    console.log('Upload avatar')
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

  const menuItems = [
    {
      icon: ShoppingBagIcon,
      label: '我的订单',
      description: '查看订单历史和状态',
      href: '/orders',
    },
    {
      icon: HeartIcon,
      label: '我的收藏',
      description: '查看收藏的商品',
      href: '/favorites',
    },
    {
      icon: MapPinIcon,
      label: '收货地址',
      description: '管理收货地址',
      href: '/addresses',
    },
    {
      icon: CreditCardIcon,
      label: '支付方式',
      description: '管理支付方式',
      href: '/payment-methods',
    },
    {
      icon: Cog6ToothIcon,
      label: '账户设置',
      description: '修改密码和安全设置',
      href: '/settings',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <button
                onClick={handleAvatarUpload}
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
              >
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.full_name || profile?.username || '用户'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                注册时间: {new Date(user.created_at || '').toLocaleDateString('zh-CN')}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '保存中...' : isEditing ? '保存' : '编辑资料'}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">收货地址</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      省份
                    </label>
                    <input
                      type="text"
                      value={formData.address.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      城市
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      区县
                    </label>
                    <input
                      type="text"
                      value={formData.address.district}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      邮编
                    </label>
                    <input
                      type="text"
                      value={formData.address.postal_code}
                      onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">0</div>
            <div className="text-sm text-gray-600 mt-1">待付款订单</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 mt-1">待收货订单</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600 mt-1">收藏商品</div>
          </div>
        </div>
      </div>
    </div>
  )
}