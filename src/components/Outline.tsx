import React, { useMemo } from 'react'
import { Hash, ChevronRight, List, FileText } from 'lucide-react'
import { useAppStore } from '@/store'
import { extractTOC } from '@/utils/markdown'
import clsx from 'clsx'

interface TOCItem {
  level: number
  title: string
  anchor: string
  line: number
}

export function Outline() {
  const { editorState, currentFile, settings } = useAppStore()

  // 从当前内容提取目录
  const tocItems = useMemo(() => {
    if (!editorState.content) return []
    
    const toc = extractTOC(editorState.content, {
      autoNumberHeadings: settings.autoNumberHeadings
    })
    
    // 计算每个标题在原文中的行号
    const lines = editorState.content.split('\n')
    let currentHeadingIndex = 0
    const items: TOCItem[] = []
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match && currentHeadingIndex < toc.length) {
        const tocItem = toc[currentHeadingIndex]
        items.push({
          ...tocItem,
          line: index + 1
        })
        currentHeadingIndex++
      }
    })
    
    return items
  }, [editorState.content, settings.autoNumberHeadings])

  // 跳转到指定行
  const handleJumpToHeading = (lineNumber: number) => {
    const event = new CustomEvent('jumpToLine', {
      detail: { line: lineNumber }
    })
    window.dispatchEvent(event)
  }

  // 获取标题的样式类
  const getHeadingClass = (level: number) => {
    const baseClass = 'flex items-center px-3 py-2 text-sm cursor-pointer rounded-xl transition-all duration-200 group hover:bg-primary-50 dark:hover:bg-primary-900/20'
    
    switch (level) {
      case 1:
        return clsx(baseClass, 'font-bold text-slate-800 dark:text-slate-200')
      case 2:
        return clsx(baseClass, 'font-semibold text-slate-700 dark:text-slate-300 ml-2')
      case 3:
        return clsx(baseClass, 'font-medium text-slate-600 dark:text-slate-400 ml-4')
      case 4:
        return clsx(baseClass, 'text-slate-600 dark:text-slate-400 ml-6')
      case 5:
        return clsx(baseClass, 'text-slate-500 dark:text-slate-500 ml-8')
      case 6:
        return clsx(baseClass, 'text-slate-500 dark:text-slate-500 ml-10')
      default:
        return baseClass
    }
  }

  return (
    <div className="w-80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 flex flex-col outline-panel">
      {/* 头部 */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
            <List size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">
              文档大纲
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              快速导航标题
            </p>
          </div>
        </div>
      </div>

      {/* 大纲内容 */}
      <div className="flex-1 overflow-auto py-3">
        {tocItems.length > 0 ? (
          <div className="space-y-1 px-3">
            {tocItems.map((item, index) => (
              <div
                key={`${item.line}-${index}`}
                className={getHeadingClass(item.level)}
                onClick={() => handleJumpToHeading(item.line)}
                title={`跳转到第 ${item.line} 行`}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {/* 层级指示器 */}
                  <div className="flex items-center mr-2">
                    <Hash size={12} className="text-primary-500 opacity-60" />
                    <span className="text-xs text-primary-500 opacity-60 ml-0.5">
                      {item.level}
                    </span>
                  </div>
                  
                  {/* 标题文本 */}
                  <span className="truncate flex-1">{item.title}</span>
                  
                  {/* 右箭头指示器 */}
                  <ChevronRight 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-500" 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <FileText size={28} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">暂无标题</p>
            <p className="text-xs text-slate-400 mt-1">
              {currentFile ? '在文档中添加 # 标题' : '请先打开一个文档'}
            </p>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      {tocItems.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-25 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>共 {tocItems.length} 个标题</span>
            <span>点击跳转</span>
          </div>
        </div>
      )}
    </div>
  )
} 