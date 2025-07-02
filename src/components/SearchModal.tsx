import React, { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store'
import { FileItem } from '@/types'
import clsx from 'clsx'

interface SearchResult {
  file: FileItem
  matches: Array<{
    line: number
    content: string
    matchStart: number
    matchEnd: number
  }>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { files, openFile } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // 搜索文件内容
  const searchFiles = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const searchResults: SearchResult[] = []
    
    const searchInFiles = (fileList: FileItem[]) => {
      for (const file of fileList) {
        if (file.type === 'file' && file.content) {
          const lines = file.content.split('\n')
          const matches: SearchResult['matches'] = []
          
          lines.forEach((line, index) => {
            const lowerLine = line.toLowerCase()
            const lowerQuery = searchQuery.toLowerCase()
            let startIndex = 0
            
            while (true) {
              const matchIndex = lowerLine.indexOf(lowerQuery, startIndex)
              if (matchIndex === -1) break
              
              matches.push({
                line: index + 1,
                content: line,
                matchStart: matchIndex,
                matchEnd: matchIndex + searchQuery.length
              })
              
              startIndex = matchIndex + 1
            }
          })
          
          if (matches.length > 0) {
            searchResults.push({ file, matches })
          }
        } else if (file.type === 'folder' && file.children) {
          searchInFiles(file.children)
        }
      }
    }
    
    searchInFiles(files)
    return searchResults
  }

  // 处理搜索
  useEffect(() => {
    const results = searchFiles(query)
    setResults(results)
    setSelectedIndex(0)
  }, [query, files])

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const totalResults = results.reduce((sum, result) => sum + result.matches.length, 0)
      setSelectedIndex(prev => (prev + 1) % Math.max(1, totalResults))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const totalResults = results.reduce((sum, result) => sum + result.matches.length, 0)
      setSelectedIndex(prev => (prev - 1 + totalResults) % Math.max(1, totalResults))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelectResult()
    }
  }

  // 选择搜索结果
  const handleSelectResult = () => {
    let currentIndex = 0
    
    for (const result of results) {
      for (const match of result.matches) {
        if (currentIndex === selectedIndex) {
          openFile(result.file)
          onClose()
          
          // 跳转到对应行（这里只是简单处理，实际项目中可能需要更复杂的逻辑）
          setTimeout(() => {
            const event = new CustomEvent('jumpToLine', {
              detail: { line: match.line }
            })
            window.dispatchEvent(event)
          }, 100)
          
          return
        }
        currentIndex++
      }
    }
  }

  // 高亮匹配文本
  const highlightMatch = (text: string, start: number, end: number) => {
    return (
      <>
        {text.substring(0, start)}
        <span className="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded">
          {text.substring(start, end)}
        </span>
        {text.substring(end)}
      </>
    )
  }

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-[55] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-96 overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* 搜索输入 */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索文件内容..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-12 py-3 text-lg border-none outline-none bg-white dark:bg-slate-700 rounded-xl shadow-lg placeholder-slate-400"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-80 overflow-y-auto">
          {!query ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                <Search size={32} className="opacity-50" />
              </div>
              <p className="font-medium">输入关键词开始搜索</p>
              <p className="text-sm text-slate-400 mt-1">搜索文件名和内容</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                <Search size={32} className="opacity-50" />
              </div>
              <p className="font-medium">没有找到匹配的内容</p>
              <p className="text-sm text-slate-400 mt-1">尝试使用不同的关键词</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, resultIndex) => (
                <div key={result.file.id} className="mb-4">
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-t">
                    <FileText size={16} className="mr-2" />
                    {result.file.name}
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                      {result.matches.length} 个匹配
                    </span>
                  </div>
                  
                  <div className="border border-t-0 border-gray-200 dark:border-gray-600 rounded-b">
                    {result.matches.map((match, matchIndex) => {
                      const globalIndex = results.slice(0, resultIndex).reduce((sum, r) => sum + r.matches.length, 0) + matchIndex
                      const isSelected = globalIndex === selectedIndex
                      
                      return (
                        <div
                          key={`${match.line}-${matchIndex}`}
                          className={clsx(
                            'px-3 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                            isSelected && 'bg-primary-50 dark:bg-primary-900/30'
                          )}
                          onClick={() => {
                            setSelectedIndex(globalIndex)
                            handleSelectResult()
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                第 {match.line} 行
                              </div>
                              <div className="text-sm font-mono truncate">
                                {highlightMatch(match.content, match.matchStart, match.matchEnd)}
                              </div>
                            </div>
                            <ArrowRight size={14} className="text-gray-400 ml-2 flex-shrink-0" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        {results.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
            <span className="font-medium">使用 ↑↓ 键导航，Enter 选择，Esc 关闭</span>
          </div>
        )}
      </div>
    </div>
  )
} 