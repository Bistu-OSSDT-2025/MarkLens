// 文件系统类型
export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  content?: string
  children?: FileItem[]
  size?: number
  modified?: Date
  isOpen?: boolean
}

// 编辑器类型
export interface EditorState {
  content: string
  cursorPosition: {
    line: number
    column: number
  }
  isModified: boolean
  wordCount: number
  charCount: number
  selectedText: string
}

// 应用设置类型
export interface AppSettings {
  theme: 'light' | 'dark'
  fontSize: number
  fontFamily: string
  lineHeight: number
  wordWrap: boolean
  showLineNumbers: boolean
  tabSize: number
  autoSave: boolean
  autoSaveInterval: number
  previewMode: 'live' | 'side' | 'preview'
  autoNumberHeadings: boolean
}

// 应用状态类型
export interface AppState {
  // 文件状态
  files: FileItem[]
  currentFile: FileItem | null
  openFiles: FileItem[]
  recentFiles: FileItem[]
  
  // UI状态
  sidebarOpen: boolean
  outlineOpen: boolean
  settings: AppSettings
  
  // 编辑器状态
  editorState: EditorState
  
  // 搜索状态
  searchQuery: string
  searchResults: FileItem[]
}

// 快捷键配置
export interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: string
  description: string
}

// 主题配置
export interface ThemeConfig {
  name: string
  colors: {
    background: string
    foreground: string
    accent: string
    border: string
    sidebar: string
    editor: string
    preview: string
  }
  fonts: {
    ui: string
    editor: string
    code: string
  }
} 