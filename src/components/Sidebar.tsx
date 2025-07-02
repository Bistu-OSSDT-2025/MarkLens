import React, { useState, useMemo, useEffect } from 'react'
import { 
  FolderOpen, 
  Folder,
  FileText, 
  Search, 
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { useAppStore } from '@/store'
import { FileItem } from '@/types'
import clsx from 'clsx'

interface FileTreeItemProps {
  file: FileItem
  level: number
  isExpanded: boolean
  onToggle: () => void
}

function FileTreeItem({ file, level, isExpanded, onToggle }: FileTreeItemProps) {
  const { currentFile, openFile } = useAppStore()
  const isActive = currentFile?.id === file.id

  const handleClick = () => {
    if (file.type === 'folder') {
      onToggle()
    } else {
      openFile(file)
    }
  }

  return (
    <div>
      <div
        className={clsx(
          'flex items-center px-3 py-2.5 cursor-pointer rounded-xl mx-1 transition-all duration-200 file-tree-item group',
          isActive && 'active',
          'hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={handleClick}
      >
        {file.type === 'folder' && (
          <button className="p-0.5 mr-1">
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}

        <div className="mr-3">
          {file.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen size={18} className="text-primary-500" />
            ) : (
              <Folder size={18} className="text-primary-500" />
            )
          ) : (
            <FileText size={18} className="text-slate-500 dark:text-slate-400" />
          )}
        </div>

        <span className="text-sm font-medium truncate flex-1">{file.name}</span>

        {file.type === 'file' && (
          <button className="p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
            <MoreVertical size={14} />
          </button>
        )}
      </div>

      {file.type === 'folder' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItemContainer
              key={child.id}
              file={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FileTreeItemContainer({ file, level }: { file: FileItem; level: number }) {
  const [isExpanded, setIsExpanded] = useState(file.isOpen || false)

  return (
    <FileTreeItem
      file={file}
      level={level}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    />
  )
}

export function Sidebar() {
  const { files, searchQuery, searchResults, setSearchQuery, search, addFile, openFile } = useAppStore()
  const [localSearchQuery, setLocalSearchQuery] = useState('')

  // 文件导入处理函数
  const handleImportFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.txt,.markdown'
    input.multiple = true
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          const newFile: FileItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'file',
            path: file.name,
            content: content,
            modified: new Date()
          }
          
          addFile(newFile)
          
          // 显示成功提示
          const toastEvent = new CustomEvent('showToast', {
            detail: { message: `文件 "${file.name}" 导入成功`, type: 'success' }
          })
          window.dispatchEvent(toastEvent)
        }
        
        reader.onerror = () => {
          const errorEvent = new CustomEvent('showToast', {
            detail: { message: `文件 "${file.name}" 导入失败`, type: 'error' }
          })
          window.dispatchEvent(errorEvent)
        }
        
        reader.readAsText(file)
      })
    }
    
    input.click()
  }

  // 监听导入事件
  useEffect(() => {
    const handleTriggerImport = () => {
      handleImportFile()
    }

    window.addEventListener('triggerImport', handleTriggerImport)
    
    return () => {
      window.removeEventListener('triggerImport', handleTriggerImport)
    }
  }, [handleImportFile])

  const displayFiles = useMemo(() => {
    return searchQuery ? searchResults : files
  }, [searchQuery, searchResults, files])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setLocalSearchQuery(query)
    setSearchQuery(query)
    search(query)
  }

  const handleNewFile = () => {
    const fileName = prompt('请输入文件名（包含扩展名）:', 'untitled.md')
    if (fileName && fileName.trim()) {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: fileName.trim(),
        type: 'file',
        path: fileName.trim(),
        content: `# ${fileName.replace('.md', '')}\n\n开始你的写作...\n`,
        modified: new Date()
      }
      
      addFile(newFile)
      openFile(newFile)
      
      // 显示成功提示
      const event = new CustomEvent('showToast', {
        detail: { message: `文件 "${fileName}" 创建成功`, type: 'success' }
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <div className="w-80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 flex flex-col sidebar">
      {/* 头部 */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">
              文件管理器
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              管理您的文档
            </p>
          </div>
          <button
            onClick={handleNewFile}
            className="p-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            title="新建文件"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
          />
          <input
            type="text"
            placeholder="搜索文件..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className={clsx(
              'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all duration-200',
              'bg-white dark:bg-slate-800',
              'border-slate-200 dark:border-slate-600',
              'text-slate-800 dark:text-slate-200',
              'placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'hover:border-slate-300 dark:hover:border-slate-500'
            )}
          />
        </div>
      </div>

      {/* 文件列表 */}
      <div className="flex-1 overflow-auto py-2">
        {displayFiles.length > 0 ? (
          <div className="space-y-1 px-3">
            {displayFiles.map((file) => (
              <FileTreeItemContainer
                key={file.id}
                file={file}
                level={0}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Search size={28} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">没有找到匹配的文件</p>
            <p className="text-xs text-slate-400 mt-1">尝试使用不同的关键词</p>
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <FileText size={28} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">暂无文件</p>
            <p className="text-xs text-slate-400 mt-1">创建您的第一个文档</p>
          </div>
        )}
      </div>

      {/* 底部操作区 */}
      {!searchQuery && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-25 dark:bg-slate-800/50">
          <div className="flex space-x-3">
            <button
              onClick={handleNewFile}
              className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 btn btn-primary"
            >
              新建文件
            </button>
            <button
              onClick={handleImportFile}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 font-medium border border-slate-200 dark:border-slate-600 hover:scale-105 btn btn-secondary"
            >
              导入文件
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 