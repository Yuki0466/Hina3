import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const { getTotalItems } = useCart(user?.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const cartItemCount = getTotalItems()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">电商商城</h1>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索商品..."
                className="input-field pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              分类
            </Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="ml-2">{profile?.full_name || profile?.username || '用户'}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    个人中心
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    我的订单
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                登录/注册
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索商品..."
              className="input-field pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/categories"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              分类
            </Link>
            
            <Link
              to="/cart"
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              购物车
              {cartItemCount > 0 && (
                <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  个人中心
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  我的订单
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                登录/注册
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}