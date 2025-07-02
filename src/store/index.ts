import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, FileItem, EditorState, AppSettings } from '@/types'

// 默认设置
const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 14,
  fontFamily: 'Inter',
  lineHeight: 1.6,
  wordWrap: true,
  showLineNumbers: false,
  tabSize: 2,
  autoSave: true,
  autoSaveInterval: 30000, // 30秒
  previewMode: 'live',
  autoNumberHeadings: true,
}

// 默认编辑器状态
const defaultEditorState: EditorState = {
  content: '',
  cursorPosition: { line: 1, column: 1 },
  isModified: false,
  wordCount: 0,
  charCount: 0,
  selectedText: '',
}

// 示例文件数据
const sampleFiles: FileItem[] = [
  {
    id: '1',
    name: 'README.md',
    type: 'file',
    path: 'README.md',
    content: `# 欢迎使用 MarkLens

一个现代化的 Markdown 编辑器，灵感来自 Typora。

## 功能特性

### 核心功能
- ✨ **所见即所得编辑**：实时 Markdown 渲染
- 🎨 **现代化界面**：简洁美观，支持深浅色主题  
- ⚡ **智能编辑**：快捷键、自动补全、语法高亮
- 📁 **文件管理**：侧边栏文件浏览器

### 高级功能
- 📋 **文档大纲**：自动生成标题结构，快速导航
- 🔍 **全文搜索**：快速查找文件内容
- ⚙️ **自定义设置**：个性化编辑器体验

## 快捷键

### 编辑快捷键
- \`Ctrl/Cmd + B\` - **粗体**
- \`Ctrl/Cmd + I\` - *斜体*
- \`Ctrl/Cmd + K\` - [链接]()
- \`Ctrl/Cmd + \`\` - \`代码\`

### 导航快捷键
- \`Ctrl/Cmd + F\` - 搜索
- \`Ctrl/Cmd + S\` - 保存

## 开始使用

点击右上角的大纲按钮查看文档结构，开始您的写作之旅吧！

### 下一步
1. 创建新文件
2. 编写内容
3. 使用大纲导航`,
    modified: new Date(),
  },
  {
    id: '2',
    name: 'docs',
    type: 'folder',
    path: 'docs',
    children: [
      {
        id: '3',
        name: 'getting-started.md',
        type: 'file',
        path: 'docs/getting-started.md',
        content: `# 快速开始指南

本指南将帮助您快速上手 MarkLens 编辑器。

## 安装步骤

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装命令
\`\`\`bash
# 克隆项目
git clone https://github.com/your-repo/marklens

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

## 基本使用

### 创建文件
1. 点击左侧的"新建文件"按钮
2. 输入文件名（建议使用 .md 扩展名）
3. 开始编写内容

### 编辑技巧
1. 使用 # 创建标题
2. 利用工具栏快速插入格式
3. 享受所见即所得的体验

### 导航功能
1. 使用右侧大纲快速跳转
2. 通过搜索功能查找内容
3. 利用文件管理器组织文档

## 高级功能

### 实时预览
- 分屏模式同时显示编辑和预览
- 实时渲染 Markdown 语法
- 支持数学公式和代码高亮

### 自定义设置
- 主题切换（深色/浅色）
- 字体和字号调整
- 编辑器行为配置
`,
      },
      {
        id: '4',
        name: 'features.md',
        type: 'file',
        path: 'docs/features.md',
        content: `# 功能详解

本文档详细介绍 MarkLens 的各项功能。

## 编辑器功能

### 实时预览
无需切换模式，直接在编辑器中看到渲染效果。

#### 预览模式
- **编辑模式**：专注于文本编辑
- **分屏模式**：同时显示编辑和预览
- **预览模式**：纯预览界面

### 语法高亮
支持代码块语法高亮，提升代码可读性。

#### 支持的语言
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- 以及更多...

### 智能补全
自动完成 Markdown 语法，提高编写效率。

#### 自动补全功能
- 列表项自动续行
- 引用块自动续行
- 有序列表自动编号
- 括号和引号配对

## 导航功能

### 文档大纲
- 自动识别标题结构
- 支持 H1-H6 级别标题
- 点击快速跳转
- 层级缩进显示

### 文件管理
- 文件夹树状结构
- 文件搜索功能
- 文件导入导出
- 最近文件记录

## 自定义设置

### 外观设置
- 深色/浅色主题
- 字体族选择
- 字号调整
- 行高设置

### 编辑器设置
- 自动换行
- 显示行号
- Tab 大小
- 自动保存
`,
      },
    ],
  },
  {
    id: '5',
    name: 'blog.md',
    type: 'file',
    path: 'blog.md',
    content: `# 我的博客

## 今日思考

写作是思考的过程，MarkLens 让这个过程更加流畅。

## 代码示例

\`\`\`javascript
const editor = new MarkLens({
  theme: 'dark',
  livePreview: true
});
\`\`\`

## 数学公式

当 $a \\ne 0$，方程 $ax^2 + bx + c = 0$ 的解为：

$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
`,
  },
]

interface AppStore extends AppState {
  // 文件操作
  setFiles: (files: FileItem[]) => void
  addFile: (file: FileItem) => void
  updateFile: (id: string, content: string) => void
  deleteFile: (id: string) => void
  setCurrentFile: (file: FileItem | null) => void
  openFile: (file: FileItem) => void
  closeFile: (id: string) => void
  
  // UI操作
  toggleSidebar: () => void
  toggleOutline: () => void
  updateSettings: (settings: Partial<AppSettings>) => void
  
  // 编辑器操作
  updateEditorState: (state: Partial<EditorState>) => void
  updateContent: (content: string) => void
  
  // 搜索操作
  setSearchQuery: (query: string) => void
  search: (query: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      files: sampleFiles,
      currentFile: sampleFiles[0],
      openFiles: [sampleFiles[0]],
      recentFiles: [],
      sidebarOpen: true,
      outlineOpen: true,
      settings: defaultSettings,
      editorState: {
        ...defaultEditorState,
        content: sampleFiles[0].content || '',
      },
      searchQuery: '',
      searchResults: [],

      // 文件操作
      setFiles: (files) => set({ files }),
      
      addFile: (file) => set((state) => ({
        files: [...state.files, file],
      })),
      
      updateFile: (id, content) => set((state) => {
        const updateFileRecursive = (files: FileItem[]): FileItem[] =>
          files.map(file => {
            if (file.id === id) {
              return { ...file, content, modified: new Date() }
            }
            if (file.children) {
              return { ...file, children: updateFileRecursive(file.children) }
            }
            return file
          })
        
        return {
          files: updateFileRecursive(state.files),
          currentFile: state.currentFile?.id === id 
            ? { ...state.currentFile, content }
            : state.currentFile,
        }
      }),
      
      deleteFile: (id) => set((state) => {
        const removeFileRecursive = (files: FileItem[]): FileItem[] =>
          files.filter(file => {
            if (file.id === id) return false
            if (file.children) {
              file.children = removeFileRecursive(file.children)
            }
            return true
          })
        
        return {
          files: removeFileRecursive(state.files),
          openFiles: state.openFiles.filter(f => f.id !== id),
          currentFile: state.currentFile?.id === id ? null : state.currentFile,
        }
      }),
      
      setCurrentFile: (file) => set((state) => ({
        currentFile: file,
        editorState: file ? {
          ...state.editorState,
          content: file.content || '',
          isModified: false,
        } : state.editorState,
      })),
      
      openFile: (file) => set((state) => {
        const isAlreadyOpen = state.openFiles.some(f => f.id === file.id)
        return {
          currentFile: file,
          openFiles: isAlreadyOpen ? state.openFiles : [...state.openFiles, file],
          editorState: {
            ...state.editorState,
            content: file.content || '',
            isModified: false,
          },
        }
      }),
      
      closeFile: (id) => set((state) => {
        const newOpenFiles = state.openFiles.filter(f => f.id !== id)
        const newCurrentFile = state.currentFile?.id === id 
          ? (newOpenFiles[0] || null)
          : state.currentFile
        
        return {
          openFiles: newOpenFiles,
          currentFile: newCurrentFile,
          editorState: newCurrentFile ? {
            ...state.editorState,
            content: newCurrentFile.content || '',
            isModified: false,
          } : state.editorState,
        }
      }),
      
      // UI操作
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),
      
      toggleOutline: () => set((state) => ({
        outlineOpen: !state.outlineOpen,
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      // 编辑器操作
      updateEditorState: (newState) => set((state) => ({
        editorState: { ...state.editorState, ...newState },
      })),
      
      updateContent: (content) => set((state) => {
        // 计算字数和字符数
        const words = content.trim().split(/\s+/).filter(w => w.length > 0)
        const wordCount = words.length
        const charCount = content.length
        
        const newEditorState = {
          ...state.editorState,
          content,
          wordCount,
          charCount,
          isModified: true,
        }
        
        // 如果有当前文件，更新其内容
        if (state.currentFile) {
          get().updateFile(state.currentFile.id, content)
        }
        
        return { editorState: newEditorState }
      }),
      
      // 搜索操作
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      search: (query) => set((state) => {
        if (!query.trim()) {
          return { searchResults: [] }
        }
        
        const searchInFiles = (files: FileItem[]): FileItem[] => {
          const results: FileItem[] = []
          
          for (const file of files) {
            if (file.type === 'file') {
              if (file.name.toLowerCase().includes(query.toLowerCase()) ||
                  file.content?.toLowerCase().includes(query.toLowerCase())) {
                results.push(file)
              }
            } else if (file.children) {
              results.push(...searchInFiles(file.children))
            }
          }
          
          return results
        }
        
        return { searchResults: searchInFiles(state.files) }
      }),
    }),
    {
      name: 'marklens-storage',
      partialize: (state) => ({
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        outlineOpen: state.outlineOpen,
        recentFiles: state.recentFiles,
      }),
    }
  )
) 