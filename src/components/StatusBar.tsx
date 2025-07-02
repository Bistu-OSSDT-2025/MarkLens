import React from 'react'
import { useAppStore } from '@/store'
import { Clock, FileText, Hash, MapPin } from 'lucide-react'
import clsx from 'clsx'

export function StatusBar() {
  const { editorState, currentFile, settings } = useAppStore()

  const formatTime = (date?: Date) => {
    if (!date) return '--:--'
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs flex items-center justify-between px-6 status-bar shadow-lg">
      {/* 左侧信息 */}
      <div className="flex items-center space-x-6">
        {/* 光标位置 */}
        <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-lg">
          <MapPin size={12} />
          <span className="font-medium">
            行 {editorState.cursorPosition.line}，列 {editorState.cursorPosition.column}
          </span>
        </div>

        {/* 文件信息 */}
        <div className="flex items-center space-x-2">
          <FileText size={12} />
          <span className="font-medium">{currentFile?.name || '未命名文档'}</span>
        </div>

        {/* 编码和类型 */}
        <div className="flex items-center space-x-4 text-white/70">
          <span>UTF-8</span>
          <span>•</span>
          <span>Markdown</span>
        </div>
      </div>

      {/* 右侧统计 */}
      <div className="flex items-center space-x-6">
        {/* 选中文本 */}
        {editorState.selectedText && (
          <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg">
            <span className="font-medium">已选择 {editorState.selectedText.length} 个字符</span>
          </div>
        )}

        {/* 字数统计 */}
        <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-lg">
          <Hash size={12} />
          <span className="font-medium">
            {editorState.wordCount} 字 | {editorState.charCount} 字符
          </span>
        </div>

        {/* 修改状态 */}
        <div className={clsx(
          'flex items-center space-x-1 px-2 py-1 rounded-lg font-medium',
          editorState.isModified 
            ? 'bg-amber-400/20 text-amber-100' 
            : 'bg-green-400/20 text-green-100'
        )}>
          <div className={clsx(
            'w-2 h-2 rounded-full',
            editorState.isModified ? 'bg-amber-400' : 'bg-green-400'
          )}></div>
          <span>{editorState.isModified ? '未保存' : '已保存'}</span>
        </div>

        {/* 最后修改时间 */}
        {currentFile?.modified && (
          <div className="flex items-center space-x-2 text-white/70">
            <Clock size={12} />
            <span>{formatTime(currentFile.modified)}</span>
          </div>
        )}
      </div>
    </div>
  )
} 