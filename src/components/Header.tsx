import React, { useState, useEffect, useRef } from 'react'
import { 
  Menu, 
  Sun, 
  Moon, 
  Save, 
  FileText, 
  Settings,
  Search,
  MoreHorizontal,
  List
} from 'lucide-react'
import { useAppStore } from '@/store'
import { SearchModal } from './SearchModal'
import { SettingsPanel } from './SettingsPanel'
import { MoreMenu } from './MoreMenu'
import clsx from 'clsx'

export function Header() {
  const { 
    settings, 
    currentFile, 
    sidebarOpen, 
    outlineOpen,
    toggleSidebar,
    toggleOutline,
    updateSettings,
    editorState,
    updateFile
  } = useAppStore()
  
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const moreButtonRef = useRef<HTMLButtonElement>(null)

  // 监听全局搜索事件
  useEffect(() => {
    const handleOpenSearch = () => {
      setSearchModalOpen(true)
    }

    window.addEventListener('openSearch', handleOpenSearch)
    
    return () => {
      window.removeEventListener('openSearch', handleOpenSearch)
    }
  }, [])

  const handleThemeToggle = () => {
    updateSettings({ 
      theme: settings.theme === 'light' ? 'dark' : 'light' 
    })
  }

  const handleSave = () => {
    if (currentFile) {
      // 模拟保存到本地存储
      const updatedFile = {
        ...currentFile,
        content: editorState.content,
        modified: new Date()
      }
      
      // 更新文件内容
      updateFile(currentFile.id, editorState.content)
      
      // 显示保存成功提示
      const event = new CustomEvent('showToast', {
        detail: { message: '文件保存成功', type: 'success' }
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0 toolbar relative z-40">
      {/* 左侧 */}
      <div className="flex items-center space-x-4">
        {/* 侧边栏切换 */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-200',
            'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105',
            sidebarOpen 
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'text-slate-600 dark:text-slate-400'
          )}
          title="切换侧边栏"
        >
          <Menu size={18} />
        </button>
        
        {/* 应用标题 */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              MarkLens
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Markdown Editor</p>
          </div>
        </div>

        {/* 当前文件 */}
        {currentFile && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-48">
              {currentFile.name}
            </span>
            {editorState.isModified && (
              <span className="w-2 h-2 bg-amber-400 rounded-full" title="未保存的更改"></span>
            )}
          </div>
        )}
      </div>

      {/* 右侧 */}
      <div className="flex items-center space-x-1">
        {/* 搜索按钮 */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
          title="搜索 (Ctrl+F)"
        >
          <Search size={18} />
        </button>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-200 hover:scale-105',
            editorState.isModified
              ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 hover:bg-success-200 dark:hover:bg-success-900/50'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-success-600 dark:hover:text-success-400'
          )}
          title="保存 (Ctrl+S)"
        >
          <Save size={18} />
        </button>

        {/* 主题切换 */}
        <button
          onClick={handleThemeToggle}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 text-slate-600 dark:text-slate-400 hover:text-amber-500"
          title="切换主题"
        >
          {settings.theme === 'dark' ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* 大纲切换 */}
        <button
          onClick={toggleOutline}
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-200 hover:scale-105',
            outlineOpen
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
          )}
          title="切换大纲 (Ctrl+\)"
        >
          <List size={18} />
        </button>

        {/* 设置按钮 */}
        <button
          onClick={() => setSettingsPanelOpen(true)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          title="设置"
        >
          <Settings size={18} />
        </button>

        {/* 更多选项 */}
        <div className="relative">
          <button
            ref={moreButtonRef}
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={clsx(
              'p-2.5 rounded-xl transition-all duration-200 hover:scale-105',
              moreMenuOpen
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
            title="更多选项"
          >
            <MoreHorizontal size={18} />
          </button>
          
          <MoreMenu 
            isOpen={moreMenuOpen}
            onClose={() => setMoreMenuOpen(false)}
            buttonRef={moreButtonRef}
          />
        </div>
      </div>
      
      {/* 搜索模态框 */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
      
      {/* 设置面板 */}
      <SettingsPanel 
        isOpen={settingsPanelOpen} 
        onClose={() => setSettingsPanelOpen(false)} 
      />
    </header>
  )
} 