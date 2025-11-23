import { useEffect, useState } from 'react'

export function SimpleDebug() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    }

    addLog('组件已加载')
    
    // 检查模块导入
    import('@/data/mockData').then(({ mockProducts, mockCategories }) => {
      addLog(`模拟数据加载成功: ${mockProducts.length} 商品, ${mockCategories.length} 分类`)
    }).catch(error => {
      addLog(`模拟数据加载失败: ${error.message}`)
    })

    // 检查 API 服务
    import('@/services/api').then(({ apiService }) => {
      apiService.getProducts().then(products => {
        addLog(`API 返回商品: ${products.length}`)
        console.log('API 返回的商品:', products)
      }).catch(error => {
        addLog(`API 错误: ${error.message}`)
      })
    }).catch(error => {
      addLog(`API 服务加载失败: ${error.message}`)
    })

    // 检查环境变量
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY
    addLog(`环境变量: URL=${supabaseUrl ? '已设置' : '未设置'}, Key=${hasKey ? '已设置' : '未设置'}`)

  }, [])

  return (
    <div className="fixed top-20 left-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-h-96 overflow-y-auto z-50">
      <h3 className="font-bold text-lg mb-3">调试日志</h3>
      <div className="space-y-1 text-xs font-mono">
        {logs.length === 0 ? (
          <p className="text-gray-500">等待日志...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="border-b border-gray-100 pb-1">
              {log}
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 w-full btn btn-outline text-sm"
      >
        刷新页面
      </button>
    </div>
  )
}