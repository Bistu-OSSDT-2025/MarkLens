import React, { useRef, useEffect, useState, useCallback } from 'react'
import { 
  Bold, 
  Italic, 
  Link, 
  Code, 
  List, 
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Table,
  Image,
  Eye,
  Edit3,
  Columns
} from 'lucide-react'
import { useAppStore } from '@/store'
import { renderMarkdown, insertMarkdownSyntax, getDocumentStats } from '@/utils/markdown'
import clsx from 'clsx'

// 工具栏按钮配置
const toolbarItems = [
  {
    icon: Bold,
    title: '粗体 (Ctrl+B)',
    action: 'bold',
    syntax: { prefix: '**', suffix: '**', placeholder: '粗体文本' }
  },
  {
    icon: Italic,
    title: '斜体 (Ctrl+I)',
    action: 'italic',
    syntax: { prefix: '*', suffix: '*', placeholder: '斜体文本' }
  },
  {
    icon: Code,
    title: '行内代码 (Ctrl+`)',
    action: 'code',
    syntax: { prefix: '`', suffix: '`', placeholder: '代码' }
  },
  {
    icon: Link,
    title: '链接 (Ctrl+K)',
    action: 'link',
    syntax: { prefix: '[', suffix: '](url)', placeholder: '链接文本' }
  },
  { type: 'separator' },
  {
    icon: Heading1,
    title: '一级标题',
    action: 'h1',
    syntax: { prefix: '# ', placeholder: '一级标题' }
  },
  {
    icon: Heading2,
    title: '二级标题',
    action: 'h2',
    syntax: { prefix: '## ', placeholder: '二级标题' }
  },
  { type: 'separator' },
  {
    icon: List,
    title: '无序列表',
    action: 'ul',
    syntax: { prefix: '- ', placeholder: '列表项' }
  },
  {
    icon: ListOrdered,
    title: '有序列表',
    action: 'ol',
    syntax: { prefix: '1. ', placeholder: '列表项' }
  },
  {
    icon: Quote,
    title: '引用',
    action: 'quote',
    syntax: { prefix: '> ', placeholder: '引用内容' }
  },
  { type: 'separator' },
  {
    icon: Table,
    title: '表格',
    action: 'table',
    syntax: { 
      prefix: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| ', 
      suffix: ' |  |  |',
      placeholder: '内容'
    }
  },
  {
    icon: Image,
    title: '图片',
    action: 'image',
    syntax: { prefix: '![', suffix: '](url)', placeholder: '图片描述' }
  }
]

export function Editor() {
  const { 
    currentFile, 
    editorState, 
    updateContent, 
    updateEditorState,
    settings,
    updateSettings,
    updateFile
  } = useAppStore()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState({ start: 0, end: 0 })

  // 内容变化处理
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    updateContent(newContent)
    
    // 更新统计信息
    const stats = getDocumentStats(newContent)
    updateEditorState({
      wordCount: stats.wordCount,
      charCount: stats.charCount,
    })
  }, [updateContent, updateEditorState])

  // 选择文本变化处理
  const handleSelectionChange = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    setSelection({ start, end })

    // 计算光标位置
    const content = textarea.value
    const textBeforeCursor = content.substring(0, start)
    const lines = textBeforeCursor.split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1

    updateEditorState({
      cursorPosition: { line, column },
      selectedText: content.substring(start, end)
    })
  }, [updateEditorState])

  // 工具栏操作处理
  const handleToolbarAction = useCallback((action: string, syntax?: any) => {
    const textarea = textareaRef.current
    if (!textarea || !syntax) return

    const { newContent, newSelection } = insertMarkdownSyntax(
      editorState.content,
      selection,
      syntax
    )

    updateContent(newContent)
    
    // 恢复焦点和选择
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newSelection.start, newSelection.end)
      setSelection(newSelection)
    }, 0)
  }, [editorState.content, selection, updateContent])

  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey

    if (isCtrlOrCmd) {
      let handled = true
      
      switch (e.key) {
        case 'b':
          handleToolbarAction('bold', { prefix: '**', suffix: '**', placeholder: '粗体文本' })
          break
        case 'i':
          handleToolbarAction('italic', { prefix: '*', suffix: '*', placeholder: '斜体文本' })
          break
        case 'k':
          handleToolbarAction('link', { prefix: '[', suffix: '](url)', placeholder: '链接文本' })
          break
        case '`':
          handleToolbarAction('code', { prefix: '`', suffix: '`', placeholder: '代码' })
          break
        case 's':
          if (currentFile) {
            updateFile(currentFile.id, editorState.content)
            const event = new CustomEvent('showToast', {
              detail: { message: '文件保存成功', type: 'success' }
            })
            window.dispatchEvent(event)
          }
          break
        default:
          handled = false
      }

      if (handled) {
        e.preventDefault()
      }
    }

    // Tab键处理
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const spaces = ' '.repeat(settings.tabSize)
      
      const newContent = 
        editorState.content.substring(0, start) + 
        spaces + 
        editorState.content.substring(end)
      
      updateContent(newContent)
      
      setTimeout(() => {
        textarea.setSelectionRange(start + spaces.length, start + spaces.length)
      }, 0)
    }
  }, [handleToolbarAction, settings.tabSize, editorState.content, updateContent])

  // 预览模式切换
  const handleViewModeChange = useCallback((mode: 'live' | 'side' | 'preview') => {
    updateSettings({ previewMode: mode })
  }, [updateSettings])

  // 文件内容同步
  useEffect(() => {
    if (currentFile && currentFile.content !== editorState.content) {
      updateContent(currentFile.content || '')
    }
  }, [currentFile, updateContent, editorState.content])

  // 监听跳转到指定行的事件
  useEffect(() => {
    const handleJumpToLine = (event: CustomEvent) => {
      const { line } = event.detail
      
      try {
        // 如果是预览模式，滚动预览区域
        if (settings.previewMode === 'preview') {
          const previewElement = previewRef.current
          if (previewElement) {
            const headings = previewElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
            
            // 计算目标标题的索引
            const lines = editorState.content.split('\n')
            let headingCount = 0
            
            for (let i = 0; i < line - 1 && i < lines.length; i++) {
              if (lines[i].match(/^#{1,6}\s+/)) {
                headingCount++
              }
            }
            
            // 检查目标行是否是标题行
            if (line <= lines.length && lines[line - 1].match(/^#{1,6}\s+/)) {
              const targetHeading = headings[headingCount]
              if (targetHeading) {
                targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return
              }
            }
            
            // 如果目标行不是标题，滚动到估算位置
            const totalHeight = previewElement.scrollHeight
            const scrollRatio = (line - 1) / lines.length
            const scrollTop = Math.max(0, totalHeight * scrollRatio - previewElement.clientHeight / 3)
            previewElement.scrollTo({ top: scrollTop, behavior: 'smooth' })
          }
          return
        }
        
        // 编辑模式和分屏模式处理
        const textarea = textareaRef.current
        if (!textarea) return

        // 计算行的位置
        const lines = textarea.value.split('\n')
        const targetLine = Math.max(0, Math.min(line - 1, lines.length - 1))
        
        // 计算字符位置
        let position = 0
        for (let i = 0; i < targetLine; i++) {
          position += lines[i].length + 1 // +1 for newline character
        }

        // 设置光标位置并聚焦
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(position, position)
          
          // 获取行高和滚动到可视区域
          const styles = getComputedStyle(textarea)
          const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2
          const scrollTop = Math.max(0, lineHeight * targetLine - textarea.clientHeight / 3)
          
          textarea.scrollTop = scrollTop

          // 分屏模式下同步预览区域滚动
          if (settings.previewMode === 'side' && previewRef.current) {
            const previewElement = previewRef.current
            const headings = previewElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
            
            // 计算目标标题的索引
            let headingCount = 0
            for (let i = 0; i < line - 1 && i < lines.length; i++) {
              if (lines[i].match(/^#{1,6}\s+/)) {
                headingCount++
              }
            }
            
            // 如果目标行是标题行，滚动到对应标题
            if (line <= lines.length && lines[line - 1].match(/^#{1,6}\s+/)) {
              const targetHeading = headings[headingCount]
              if (targetHeading) {
                targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            } else {
              // 否则按比例滚动
              const totalHeight = previewElement.scrollHeight
              const scrollRatio = (line - 1) / lines.length
              const previewScrollTop = Math.max(0, totalHeight * scrollRatio - previewElement.clientHeight / 3)
              previewElement.scrollTo({ top: previewScrollTop, behavior: 'smooth' })
            }
          }

          // 更新选择状态
          setSelection({ start: position, end: position })
          
          // 更新光标位置状态
          updateEditorState({
            cursorPosition: { line: targetLine + 1, column: 1 }
          })
        }, 100)
      } catch (error) {
        console.error('跳转到行时出错:', error)
      }
    }

    window.addEventListener('jumpToLine', handleJumpToLine as EventListener)
    
    return () => {
      window.removeEventListener('jumpToLine', handleJumpToLine as EventListener)
    }
  }, [updateEditorState, setSelection, settings.previewMode, editorState.content])

  // 渲染Markdown内容
  const renderedContent = renderMarkdown(editorState.content, {
    autoNumberHeadings: settings.autoNumberHeadings
  })

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 toolbar">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {toolbarItems.map((item, index) => {
              if (item.type === 'separator') {
                return (
                                  <div
                  key={index}
                  className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2"
                />
                )
              }

              if (!item.action || !item.icon) return null

              const Icon = item.icon
              return (
                <button
                  key={item.action}
                  onClick={() => handleToolbarAction(item.action!, item.syntax)}
                  className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                  title={item.title}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>

          {/* 视图切换 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewModeChange('live')}
              className={clsx(
                'px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center font-medium',
                settings.previewMode === 'live'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105'
              )}
            >
              <Edit3 size={16} className="mr-2" />
              编辑
            </button>
            <button
              onClick={() => handleViewModeChange('side')}
              className={clsx(
                'px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center font-medium',
                settings.previewMode === 'side'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105'
              )}
            >
              <Columns size={16} className="mr-2" />
              分屏
            </button>
            <button
              onClick={() => handleViewModeChange('preview')}
              className={clsx(
                'px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center font-medium',
                settings.previewMode === 'preview'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-105'
              )}
            >
              <Eye size={16} className="mr-2" />
              预览
            </button>
          </div>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div className="flex-1 overflow-hidden min-h-0">
        {settings.previewMode === 'live' && (
          /* 编辑模式 */
          <textarea
            ref={textareaRef}
            value={editorState.content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            placeholder="开始写作..."
            className={clsx(
              'w-full h-full resize-none outline-none px-10 py-8 overflow-y-auto',
              settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
              'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
            )}
            style={{
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
            }}
            spellCheck={false}
          />
        )}

        {settings.previewMode === 'preview' && (
          /* 预览模式 */
          <div
            ref={previewRef}
            className="w-full h-full overflow-y-auto px-10 py-8 bg-white dark:bg-slate-900 markdown-body"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        )}

        {settings.previewMode === 'side' && (
          /* 分屏模式 */
          <div className="flex h-full overflow-hidden">
            {/* 编辑区域 */}
            <div className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={editorState.content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onSelect={handleSelectionChange}
                onMouseUp={handleSelectionChange}
                placeholder="开始写作..."
                className={clsx(
                  'w-full h-full resize-none outline-none border-none px-6 py-6 overflow-y-auto',
                  settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
                  'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                )}
                style={{
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
                spellCheck={false}
              />
            </div>
            
            {/* 预览区域 */}
            <div className="flex-1 overflow-hidden">
              <div
                ref={previewRef}
                className="w-full h-full overflow-y-auto px-6 py-6 bg-gray-50 dark:bg-slate-800 markdown-body"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 