import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'
import { apiService } from '@/services/api'

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    const info = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      isConnected: false,
      tablesExist: false,
      productCount: 0,
      categoryCount: 0,
      error: null
    }

    try {
      // 检查 Supabase 连接
      const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true })
      if (error) {
        info.error = error.message
      } else {
        info.isConnected = true
        info.productCount = data?.[0]?.count || 0
      }

      // 检查分类
      const { data: catData, error: catError } = await supabase.from('categories').select('count', { count: 'exact', head: true })
      if (!catError) {
        info.categoryCount = catData?.[0]?.count || 0
      }

      info.tablesExist = info.productCount >= 0 && info.categoryCount >= 0

      // 测试 API 服务
      try {
        const products = await apiService.getProducts()
        const categories = await apiService.getCategories()
        info.apiProducts = products.length
        info.apiCategories = categories.length
      } catch (apiError) {
        info.apiError = apiError.message
      }

    } catch (e) {
      info.error = e.message
    }

    setDebugInfo(info)
  }

  const fixConfiguration = () => {
    alert('请在 .env 文件中配置正确的 Supabase URL 和 Anon Key:\n\n1. 复制 .env.example 为 .env\n2. 填入你的 Supabase 项目信息\n3. 重启开发服务器')
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">调试面板</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {expanded ? '收起' : '展开'}
          </button>
        </div>

        {!expanded ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              <span className={`font-mono ${debugInfo.supabaseUrl ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.supabaseUrl ? '已配置' : '未配置'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Anon Key:</span>
              <span className={`font-mono ${debugInfo.hasAnonKey ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.hasAnonKey ? '已配置' : '未配置'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>数据库连接:</span>
              <span className={`font-mono ${debugInfo.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.isConnected ? '正常' : '失败'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="border-t pt-2">
              <strong>环境配置:</strong>
              <div className="mt-1 space-y-1">
                <div>URL: {debugInfo.supabaseUrl || '未设置'}</div>
                <div>Key: {debugInfo.hasAnonKey ? '已设置' : '未设置'}</div>
              </div>
            </div>

            <div className="border-t pt-2">
              <strong>数据库状态:</strong>
              <div className="mt-1 space-y-1">
                <div>连接状态: {debugInfo.isConnected ? '✅ 正常' : '❌ 失败'}</div>
                <div>表存在: {debugInfo.tablesExist ? '✅ 是' : '❌ 否'}</div>
                <div>商品数量: {debugInfo.productCount}</div>
                <div>分类数量: {debugInfo.categoryCount}</div>
                {debugInfo.apiProducts !== undefined && (
                  <div>API商品: {debugInfo.apiProducts}</div>
                )}
                {debugInfo.apiCategories !== undefined && (
                  <div>API分类: {debugInfo.apiCategories}</div>
                )}
              </div>
            </div>

            {(debugInfo.error || debugInfo.apiError) && (
              <div className="border-t pt-2">
                <strong>错误信息:</strong>
                <div className="mt-1 text-red-600 font-mono text-xs">
                  {debugInfo.error || debugInfo.apiError}
                </div>
              </div>
            )}

            <div className="border-t pt-2">
              <button
                onClick={checkEnvironment}
                className="btn btn-outline text-sm mr-2"
              >
                重新检查
              </button>
              {!debugInfo.supabaseUrl || !debugInfo.hasAnonKey ? (
                <button
                  onClick={fixConfiguration}
                  className="btn btn-primary text-sm"
                >
                  修复配置
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}