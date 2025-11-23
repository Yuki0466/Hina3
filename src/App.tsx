import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Home } from '@/pages/Home'
import { ProductDetail } from '@/pages/ProductDetail'
import { Cart } from '@/pages/Cart'
import { Auth } from '@/pages/Auth'
import { Profile } from '@/pages/Profile'
import { Orders } from '@/pages/Orders'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Placeholder routes for future implementation */}
            <Route path="/category/:id" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">分类页面 - 开发中</h1></div>} />
            <Route path="/search" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">搜索结果 - 开发中</h1></div>} />
            <Route path="/checkout" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">结算页面 - 开发中</h1></div>} />
            <Route path="/favorites" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">收藏页面 - 开发中</h1></div>} />
            <Route path="/addresses" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">地址管理 - 开发中</h1></div>} />
            <Route path="/payment-methods" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">支付方式 - 开发中</h1></div>} />
            <Route path="/settings" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">账户设置 - 开发中</h1></div>} />
            <Route path="/terms" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">服务条款 - 开发中</h1></div>} />
            <Route path="/privacy" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">隐私政策 - 开发中</h1></div>} />
            <Route path="/forgot-password" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">忘记密码 - 开发中</h1></div>} />
            
            {/* 404 page */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">页面未找到</p>
                  <a href="/" className="btn btn-primary">返回首页</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App