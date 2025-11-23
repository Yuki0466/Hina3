import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

export function Auth() {
  const [searchParams] = useSearchParams()
  const isRegister = searchParams.get('mode') === 'register'
  const [mode, setMode] = useState(isRegister ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('两次输入的密码不一致')
          return
        }
        
        if (formData.password.length < 6) {
          setError('密码长度至少为6位')
          return
        }

        const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName)
        if (signUpError) {
          setError(signUpError.message)
        } else {
          // Registration successful, user will be redirected by the auth hook
          setError('')
        }
      } else {
        const { error: signInError } = await signIn(formData.email, formData.password)
        if (signInError) {
          setError(signInError.message)
        } else {
          // Login successful, user will be redirected by the auth hook
          setError('')
        }
      }
    } catch (error) {
      setError('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="text-center">
            <h1 className="text-3xl font-bold text-primary-600">电商商城</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? '登录账户' : '创建账户'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? '还没有账户？' : '已有账户？'}
            <button
              onClick={toggleMode}
              className="font-medium text-primary-600 hover:text-primary-500 ml-1"
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={mode === 'register'}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder={mode === 'login' ? '请输入密码' : '请设置密码（至少6位）'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={mode === 'register'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="请再次输入密码"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                忘记密码？
              </Link>
            </div>
          )}
        </form>

        {/* Terms for registration */}
        {mode === 'register' && (
          <div className="text-xs text-gray-600 text-center">
            注册即表示您同意我们的{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500">
              服务条款
            </Link>{' '}
            和{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
              隐私政策
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}