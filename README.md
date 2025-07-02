# MarkLens 📝

> 现代化的 Markdown 编辑器，灵感来自 Typora - 所见即所得的写作体验

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)

## ✨ 功能特性

### 🎯 核心功能
- ✅ **所见即所得编辑**：实时 Markdown 渲染，无需切换模式
- ✅ **现代化界面**：简洁美观的设计，支持深浅色主题
- ✅ **智能编辑**：快捷键支持、自动补全、语法高亮
- ✅ **文件管理**：侧边栏文件浏览器，支持搜索和导航

### 🛠️ 技术特性
- **实时预览**：边写边看，格式化效果即时呈现
- **语法高亮**：支持代码块多语言高亮显示
- **数学公式**：KaTeX 支持，实时渲染数学公式
- **快捷操作**：丰富的工具栏和键盘快捷键
- **主题系统**：内置深浅色主题，可自定义配置
- **文档统计**：实时字数、字符数、阅读时间统计

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 开始使用。

### 构建生产版本
```bash
npm run build
```

## 🎮 使用指南

### 基本操作

#### 编辑模式
- 在编辑区域直接输入 Markdown 语法
- 使用工具栏按钮快速插入格式
- 支持实时预览和编辑模式切换

#### 快捷键
- `Ctrl/Cmd + B` - **粗体**
- `Ctrl/Cmd + I` - *斜体*
- `Ctrl/Cmd + K` - [链接]()
- `Ctrl/Cmd + \`` - `行内代码`
- `Ctrl/Cmd + S` - 保存文件

#### 文件管理
- 使用侧边栏浏览文件结构
- 支持文件夹展开/收起
- 内置搜索功能，快速定位文件

### 高级功能

#### 数学公式
支持 LaTeX 语法的数学公式：

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

#### 代码高亮
支持多种编程语言的语法高亮：

```javascript
function hello() {
  console.log('Hello MarkLens!')
}
```

#### 表格编辑
便捷的表格语法：

```markdown
| 功能 | 状态 | 优先级 |
|------|------|--------|
| 编辑器 | ✅ | 高 |
| 预览 | ✅ | 高 |
| 主题 | ✅ | 中 |
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Zustand
- **样式系统**: Tailwind CSS
- **Markdown 解析**: markdown-it
- **数学公式**: KaTeX
- **代码高亮**: highlight.js
- **图标库**: Lucide React

## 📁 项目结构

```
MarkLens/
├── src/
│   ├── components/          # React 组件
│   │   ├── Editor.tsx      # 核心编辑器组件
│   │   ├── Header.tsx      # 头部导航
│   │   ├── Sidebar.tsx     # 文件浏览器
│   │   └── StatusBar.tsx   # 状态栏
│   ├── store/              # 状态管理
│   │   └── index.ts        # Zustand 状态
│   ├── utils/              # 工具函数
│   │   └── markdown.ts     # Markdown 处理
│   ├── types/              # TypeScript 类型
│   │   └── index.ts        # 类型定义
│   ├── styles/             # 样式文件
│   │   └── index.css       # 主样式
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── public/                 # 静态资源
├── package.json            # 项目配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind 配置
└── vite.config.ts         # Vite 配置
```

## 🎨 自定义配置

### 主题配置
编辑 `tailwind.config.js` 自定义颜色主题：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主色调
      }
    }
  }
}
```

### 编辑器设置
通过应用内设置或修改 `src/store/index.ts` 调整：

- 字体大小和字体族
- 行高和缩进
- 自动保存间隔
- 主题偏好

## 🚀 开发指南

### 添加新功能
1. 在 `src/components/` 创建新组件
2. 在 `src/types/` 添加类型定义
3. 更新状态管理 `src/store/index.ts`
4. 添加样式到 `src/styles/index.css`

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS 类名

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 开发流程
1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 许可证。

## 🙏 致谢

特别感谢以下项目的启发：
- [Typora](https://typora.io/) - 优秀的 Markdown 编辑器
- [markdown-it](https://github.com/markdown-it/markdown-it) - 强大的 Markdown 解析器
- [KaTeX](https://katex.org/) - 快速的数学公式渲染
- [highlight.js](https://highlightjs.org/) - 语法高亮库

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！ 