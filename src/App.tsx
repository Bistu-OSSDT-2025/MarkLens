import React, { useEffect } from 'react'
import { useAppStore } from '@/store'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Outline } from '@/components/Outline'
import { Editor } from '@/components/Editor'
import { StatusBar } from '@/components/StatusBar'
import { Toast } from '@/components/Toast'
import clsx from 'clsx'

function App() {
  const { settings, sidebarOpen, outlineOpen, toggleOutline } = useAppStore()

  // 应用主题到HTML根元素
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.theme])

  // 全局快捷键监听
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      
      if (isCtrlOrCmd && e.key === 'f') {
        e.preventDefault()
        // 触发搜索模态框
        const event = new CustomEvent('openSearch')
        window.dispatchEvent(event)
      } else if (isCtrlOrCmd && e.key === '\\') {
        e.preventDefault()
        // 切换大纲显示
        toggleOutline()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [toggleOutline])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 头部 */}
      <Header />
      
      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* 左侧：文件管理器 */}
        {sidebarOpen && <Sidebar />}
        
        {/* 中间：编辑器区域 */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 shadow-lg min-w-0 overflow-hidden">
          <Editor />
        </div>
        
        {/* 右侧：大纲 */}
        {outlineOpen && <Outline />}
      </div>
      
      {/* 状态栏 */}
      <StatusBar />
      
      {/* Toast通知 */}
      <Toast />
    </div>
  )
}

export default App