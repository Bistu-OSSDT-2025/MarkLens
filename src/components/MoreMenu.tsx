import React, { useState, useRef, useEffect } from 'react'
import { 
  Download, 
  Upload, 
  FileText, 
  HelpCircle, 
  Info,
  Github,
  Coffee,
  ChevronRight,
  FileDown,
  Globe,
  Type
} from 'lucide-react'
import { useAppStore } from '@/store'
import { renderMarkdown } from '@/utils/markdown'

interface MoreMenuProps {
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

export function MoreMenu({ isOpen, onClose, buttonRef }: MoreMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const { currentFile, editorState } = useAppStore()

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
        setShowExportMenu(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, buttonRef])

  // 创建下载链接
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 导出为 Markdown
  const exportAsMarkdown = () => {
    if (!currentFile || !editorState.content) {
      const event = new CustomEvent('showToast', {
        detail: { message: '没有内容可以导出', type: 'warning' }
      })
      window.dispatchEvent(event)
      setShowExportMenu(false)
      return
    }

    const filename = currentFile.name.endsWith('.md') ? currentFile.name : `${currentFile.name}.md`
    downloadFile(editorState.content, filename, 'text/markdown')
    
    const event = new CustomEvent('showToast', {
      detail: { message: `已导出为 ${filename}`, type: 'success' }
    })
    window.dispatchEvent(event)
    setShowExportMenu(false)
    onClose()
  }

  // 导出为 HTML
  const exportAsHTML = () => {
    if (!currentFile || !editorState.content) {
      const event = new CustomEvent('showToast', {
        detail: { message: '没有内容可以导出', type: 'warning' }
      })
      window.dispatchEvent(event)
      setShowExportMenu(false)
      return
    }

    const htmlContent = renderMarkdown(editorState.content)
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFile.name}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .markdown-body {
      font-size: 16px;
      letter-spacing: 0.1px;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      line-height: 1.4;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.875em; }
    h6 { font-size: 0.85em; color: #6b7280; }
    p { margin-bottom: 1em; }
    ul, ol { padding-left: 2em; margin-bottom: 1em; }
    li { margin-bottom: 0.25em; }
    blockquote {
      border-left: 4px solid #ddd;
      padding: 0 1em;
      margin: 1em 0;
      color: #666;
    }
    pre {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin: 1em 0;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.85em;
      line-height: 1.45;
    }
    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background-color: rgba(175, 184, 193, 0.2);
      color: #24292e;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.85em;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
      border-radius: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      border-spacing: 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.6em 1em;
      text-align: left;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
    }
    hr {
      border: none;
      height: 1px;
      background-color: #e1e4e8;
      margin: 2em 0;
    }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${htmlContent}
  </div>
</body>
</html>`

    const filename = currentFile.name.replace(/\.md$/, '.html')
    downloadFile(fullHTML, filename, 'text/html')
    
    const event = new CustomEvent('showToast', {
      detail: { message: `已导出为 ${filename}`, type: 'success' }
    })
    window.dispatchEvent(event)
    setShowExportMenu(false)
    onClose()
  }

  // 导出为纯文本
  const exportAsText = () => {
    if (!currentFile || !editorState.content) {
      const event = new CustomEvent('showToast', {
        detail: { message: '没有内容可以导出', type: 'warning' }
      })
      window.dispatchEvent(event)
      setShowExportMenu(false)
      return
    }

    // 移除 Markdown 语法，转换为纯文本
    const plainText = editorState.content
      .replace(/^#{1,6}\s+/gm, '') // 移除标题标记
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
      .replace(/`(.*?)`/g, '$1') // 移除行内代码标记
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
      .replace(/^\s*[-*+]\s+/gm, '• ') // 转换无序列表
      .replace(/^\s*\d+\.\s+/gm, '• ') // 转换有序列表
      .replace(/^>\s+/gm, '') // 移除引用标记
      .replace(/\n\s*\n/g, '\n\n') // 清理多余空行
      .trim()

    const filename = currentFile.name.replace(/\.md$/, '.txt')
    downloadFile(plainText, filename, 'text/plain')
    
    const event = new CustomEvent('showToast', {
      detail: { message: `已导出为 ${filename}`, type: 'success' }
    })
    window.dispatchEvent(event)
    setShowExportMenu(false)
    onClose()
  }

  // 导出为 PDF（使用打印功能）
  const exportAsPDF = () => {
    if (!currentFile || !editorState.content) {
      const event = new CustomEvent('showToast', {
        detail: { message: '没有内容可以导出', type: 'warning' }
      })
      window.dispatchEvent(event)
      setShowExportMenu(false)
      return
    }

    // 创建新窗口用于打印
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      const event = new CustomEvent('showToast', {
        detail: { message: '无法打开打印窗口，请检查浏览器设置', type: 'error' }
      })
      window.dispatchEvent(event)
      setShowExportMenu(false)
      return
    }

    const htmlContent = renderMarkdown(editorState.content)
    const printHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFile.name}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 20px;
    }
    .markdown-body {
      font-size: 14px;
      letter-spacing: 0.1px;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      line-height: 1.4;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    h1 { font-size: 1.8em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.4em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.2em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.9em; }
    h6 { font-size: 0.85em; color: #6b7280; }
    p { margin-bottom: 1em; }
    ul, ol { padding-left: 2em; margin-bottom: 1em; }
    li { margin-bottom: 0.25em; }
    blockquote {
      border-left: 4px solid #ddd;
      padding: 0 1em;
      margin: 1em 0;
      color: #666;
    }
    pre {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin: 1em 0;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.8em;
      line-height: 1.45;
      page-break-inside: avoid;
    }
    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background-color: rgba(175, 184, 193, 0.2);
      color: #24292e;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.85em;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
      border-radius: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      border-spacing: 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.6em 1em;
      text-align: left;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
    }
    hr {
      border: none;
      height: 1px;
      background-color: #e1e4e8;
      margin: 2em 0;
    }
    .print-header {
      text-align: center;
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 2px solid #eee;
    }
    .print-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.8em;
      color: #666;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>${currentFile.name}</h1>
    <p>导出时间: ${new Date().toLocaleString('zh-CN')}</p>
  </div>
  <div class="markdown-body">
    ${htmlContent}
  </div>
  <div class="print-footer no-print">
    <button onclick="window.print()" style="padding: 10px 20px; background: #0366d6; color: white; border: none; border-radius: 5px; cursor: pointer;">打印/保存为PDF</button>
    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">关闭</button>
  </div>
</body>
</html>`

    printWindow.document.write(printHTML)
    printWindow.document.close()
    
    const event = new CustomEvent('showToast', {
      detail: { message: '已打开打印窗口，请选择"保存为PDF"', type: 'success' }
    })
    window.dispatchEvent(event)
    setShowExportMenu(false)
    onClose()
  }

  // 处理导入功能
  const handleImport = () => {
    const event = new CustomEvent('triggerImport')
    window.dispatchEvent(event)
    onClose()
  }

  // 关闭导出菜单
  const closeExportMenu = () => {
    setShowExportMenu(false)
  }

  // 显示关于信息
  const handleAbout = () => {
    const event = new CustomEvent('showToast', {
      detail: { 
        message: 'MarkLens v1.0.0 - 现代化的 Markdown 编辑器', 
        type: 'info',
        duration: 5000
      }
    })
    window.dispatchEvent(event)
    onClose()
  }

  // 显示帮助信息
  const handleHelp = () => {
    const event = new CustomEvent('showToast', {
      detail: { 
        message: '使用 Ctrl/Cmd + F 搜索，Ctrl/Cmd + S 保存文件', 
        type: 'info',
        duration: 5000
      }
    })
    window.dispatchEvent(event)
    onClose()
  }

  // 打开GitHub
  const handleGithub = () => {
    window.open('https://github.com', '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-45 backdrop-blur-lg"
    >
      <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        文件操作
      </div>
      
      <button
        onClick={handleImport}
        className="w-full flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 rounded-xl mx-2"
      >
        <Upload size={18} className="mr-3" />
        <span className="font-medium">导入文件</span>
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="w-full flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 rounded-xl mx-2"
        >
          <Download size={18} className="mr-3" />
          <span className="font-medium">导出文件</span>
          <ChevronRight size={16} className="ml-auto" />
        </button>
        
        {showExportMenu && (
          <div className="absolute right-full top-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 mr-2 z-50">
            <button
              onClick={exportAsMarkdown}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
            >
              <FileText size={16} className="mr-3" />
              <span>Markdown (.md)</span>
            </button>
            
            <button
              onClick={exportAsHTML}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
            >
              <Globe size={16} className="mr-3" />
              <span>HTML (.html)</span>
            </button>
            
            <button
              onClick={exportAsText}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
            >
              <Type size={16} className="mr-3" />
              <span>纯文本 (.txt)</span>
            </button>
            
            <button
              onClick={exportAsPDF}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
            >
              <FileDown size={16} className="mr-3" />
              <span>PDF (打印)</span>
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 my-3 mx-2"></div>
      
      <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        帮助与信息
      </div>
      
      <button
        onClick={handleHelp}
        className="w-full flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 rounded-xl mx-2"
      >
        <HelpCircle size={18} className="mr-3" />
        <span className="font-medium">使用帮助</span>
      </button>
      
      <button
        onClick={handleGithub}
        className="w-full flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 rounded-xl mx-2"
      >
        <Github size={18} className="mr-3" />
        <span className="font-medium">GitHub 仓库</span>
      </button>
      
      <button
        onClick={handleAbout}
        className="w-full flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 rounded-xl mx-2"
      >
        <Info size={18} className="mr-3" />
        <span className="font-medium">关于 MarkLens</span>
      </button>

      <div className="border-t border-slate-200 dark:border-slate-700 my-3 mx-2"></div>
      
      <div className="px-4 py-3 flex items-center justify-center">
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center font-medium">
          <Coffee size={14} className="mr-2" />
          Made with ❤️ by MarkLens
        </span>
      </div>
    </div>
  )
} 