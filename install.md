# 📦 MarkLens 安装指南

## 系统要求

### 最低系统要求
- **操作系统**: Windows 7+, macOS 10.12+, Linux (Ubuntu 16.04+)
- **内存**: 4GB RAM (推荐 8GB)
- **硬盘空间**: 500MB 可用空间
- **网络**: 稳定的互联网连接（用于下载依赖）

### 开发环境要求
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 (或 yarn >= 1.22.0)
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🚀 快速安装

### 方法一：通过 npm 安装（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/marklens.git

# 2. 进入项目目录
cd marklens

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

### 方法二：使用 yarn 安装

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/marklens.git

# 2. 进入项目目录
cd marklens

# 3. 安装依赖
yarn install

# 4. 启动开发服务器
yarn dev
```

### 方法三：下载发布版本

1. 访问 [Releases 页面](https://github.com/yourusername/marklens/releases)
2. 下载最新版本的 `marklens-v1.0.0.zip`
3. 解压到您的本地目录
4. 按照上述步骤安装依赖

## 🔧 详细安装步骤

### 1. 准备开发环境

#### 安装 Node.js
- 访问 [Node.js 官网](https://nodejs.org/)
- 下载 LTS 版本（推荐 v18.x 或更高版本）
- 按照向导完成安装

#### 验证安装
```bash
node --version  # 应显示 v18.x.x 或更高
npm --version   # 应显示 8.x.x 或更高
```

### 2. 获取项目代码

#### 使用 Git 克隆
```bash
git clone https://github.com/yourusername/marklens.git
cd marklens
```

#### 或者下载 ZIP 文件
1. 点击 GitHub 页面上的 "Code" 按钮
2. 选择 "Download ZIP"
3. 解压到您选择的目录

### 3. 安装项目依赖

```bash
# 使用 npm（推荐）
npm install

# 或者使用 yarn
yarn install
```

### 4. 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或者使用 yarn
yarn dev
```

成功启动后，您会看到类似以下的输出：
```
  VITE v5.0.8  ready in 1.2s

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. 访问应用

在浏览器中打开 `http://localhost:5173` 即可开始使用 MarkLens。

## 🏗️ 生产环境部署

### 构建生产版本

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 部署到静态文件服务器

```bash
# 构建完成后，dist 目录包含所有静态文件
# 将 dist 目录上传到您的服务器

# 例如：部署到 Apache
cp -r dist/* /var/www/html/

# 或者部署到 Nginx
cp -r dist/* /usr/share/nginx/html/
```

### 部署到 CDN

1. 运行 `npm run build`
2. 将 `dist` 目录内容上传到您的 CDN
3. 配置 CDN 支持 SPA 路由

## 🐳 使用 Docker 部署

### 创建 Dockerfile

```dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 使用 nginx 提供静态文件
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建和运行

```bash
# 构建 Docker 镜像
docker build -t marklens .

# 运行容器
docker run -p 80:80 marklens
```

## 🔍 故障排除

### 常见问题

#### 1. Node.js 版本不兼容
```bash
# 检查 Node.js 版本
node --version

# 如果版本过低，请升级到 18.0.0 或更高版本
```

#### 2. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules

# 重新安装
npm install
```

#### 3. 端口被占用
```bash
# 查看端口使用情况
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # macOS/Linux

# 使用其他端口启动
npm run dev -- --port 3000
```

#### 4. 内存不足
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### 获取帮助

如果遇到安装问题，请：

1. 检查 [常见问题 FAQ](./FAQ.md)
2. 查看 [GitHub Issues](https://github.com/yourusername/marklens/issues)
3. 加入我们的 [Discord 社群](https://discord.gg/marklens)
4. 发送邮件到 support@marklens.com

## 📋 安装检查清单

- [ ] Node.js 版本 >= 18.0.0
- [ ] npm 版本 >= 8.0.0
- [ ] 成功克隆或下载项目
- [ ] 依赖安装完成
- [ ] 开发服务器正常启动
- [ ] 浏览器能正常访问 http://localhost:5173
- [ ] 编辑器界面正常显示
- [ ] 基本功能测试通过

## 🎉 安装完成

恭喜您！MarkLens 已成功安装。现在您可以：

1. 🚀 查看 [快速开始指南](./START_HERE.md)
2. 📖 阅读 [使用文档](./README.md)
3. 🎨 探索编辑器功能
4. �� 加入我们的社区

祝您使用愉快！ ✨ 