# 部署指南

## 🚨 修复说明

已修复以下部署问题：

1. **PostCSS 配置错误** - 将 ES6 模块语法改为 CommonJS
2. **Tailwind 配置错误** - 将 export default 改为 module.exports
3. **Hook 使用问题** - 修复 ProductCard 组件中的 useAuth hook 使用

## 🚀 Netlify 部署步骤

### 1. 环境变量设置
在 Netlify 控制台的 Site settings > Build & deploy > Environment 中添加：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_VERSION=18
```

### 2. 连接代码仓库
1. 登录 Netlify
2. 点击 "New site from Git"
3. 选择你的 Git 提供商 (GitHub/GitLab/Bitbucket)
4. 选择包含代码的仓库
5. 构建设置保持默认（将使用 netlify.toml 配置）

### 3. 构建设置
构建配置文件 `netlify.toml` 已包含正确的设置：

- **构建命令**: `npm run build`
- **发布目录**: `dist`
- **Node.js 版本**: 18

### 4. 部署触发
推送代码到主分支将自动触发部署。

## 🛠️ 本地构建测试

在部署前，可以先在本地测试构建：

```bash
# 安装依赖
npm install

# 测试构建
npm run build

# 检查输出
ls -la dist/
```

## 🔧 常见问题解决

### 问题 1: PostCSS 语法错误
**错误**: `SyntaxError: Unexpected token 'export'`
**解决**: 已修复 postcss.config.js 和 tailwind.config.js 使用 CommonJS 语法

### 问题 2: 模块解析失败
**错误**: Cannot resolve module
**解决**: 检查路径别名配置，确保使用正确的导入路径

### 问题 3: 环境变量未定义
**错误**: VITE_SUPABASE_URL is not defined
**解决**: 在 Netlify 环境变量中正确配置 Supabase 凭证

## 📋 部署检查清单

- [ ] Supabase 项目已创建
- [ ] 数据库表已导入 (database-schema.sql)
- [ ] 环境变量已配置
- [ ] 代码已推送到 Git 仓库
- [ ] Netlify 已连接到仓库
- [ ] 构建设置正确
- [ ] 域名已配置（可选）

## 🌐 域名配置

部署成功后，你可以：

1. **使用 Netlify 子域名**: `your-site.netlify.app`
2. **绑定自定义域名**: 在 Site settings > Domain management 中添加

## 🔒 HTTPS

Netlify 自动为所有站点提供 HTTPS 证书，无需额外配置。

## 📊 监控和分析

Netlify 提供：
- 构建日志
- 网站分析
- 表单处理
- 边缘函数监控

## 🔄 持续部署

设置完成后，每次推送代码到主分支都会自动触发：
1. 代码拉取
2. 依赖安装
3. 构建执行
4. 文件部署
5. 全球 CDN 分发

## 🐛 故障排除

如果构建失败：

1. **查看构建日志**: 在 Netlify 控制台查看详细错误信息
2. **本地复现**: 在本地运行 `npm run build` 看是否能复现问题
3. **检查依赖**: 确保 `package.json` 中的版本兼容
4. **环境变量**: 验证所有必需的环境变量都已设置

## 📞 获取帮助

- Netlify 文档: https://docs.netlify.com/
- Supabase 文档: https://supabase.com/docs
- 问题报告: 在 GitHub 仓库中创建 Issue