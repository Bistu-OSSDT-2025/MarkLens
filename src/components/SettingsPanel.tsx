import React from 'react'
import { X, Palette, Type, Monitor, FileText, Keyboard } from 'lucide-react'
import { useAppStore } from '@/store'
import clsx from 'clsx'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useAppStore()

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'JetBrains Mono', label: 'JetBrains Mono' },
    { value: 'Fira Code', label: 'Fira Code' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'system-ui', label: 'System UI' },
  ]

  const fontSizes = [12, 14, 16, 18, 20, 22, 24]
  const lineHeights = [1.2, 1.4, 1.6, 1.8, 2.0]
  const tabSizes = [2, 4, 8]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-700 mx-auto my-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">设置</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">自定义您的编辑器体验</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-8">
            {/* 外观设置 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette size={20} className="text-primary-500" />
                <h3 className="text-lg font-medium">外观</h3>
              </div>
              
              <div className="space-y-4 ml-6">
                {/* 主题 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">主题</label>
                  <div className="flex rounded-xl border border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-50 dark:bg-slate-700">
                    <button
                      onClick={() => updateSettings({ theme: 'light' })}
                      className={clsx(
                        'px-4 py-2 text-sm transition-all duration-200 font-medium',
                        settings.theme === 'light'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      浅色
                    </button>
                    <button
                      onClick={() => updateSettings({ theme: 'dark' })}
                      className={clsx(
                        'px-4 py-2 text-sm transition-all duration-200 font-medium',
                        settings.theme === 'dark'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      深色
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 字体设置 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Type size={20} className="text-primary-500" />
                <h3 className="text-lg font-medium">字体</h3>
              </div>
              
              <div className="space-y-4 ml-6">
                {/* 字体族 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">字体族</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-sm font-medium transition-all duration-200 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 字体大小 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">字体大小</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    {fontSizes.map(size => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>

                {/* 行高 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">行高</label>
                  <select
                    value={settings.lineHeight}
                    onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    {lineHeights.map(height => (
                      <option key={height} value={height}>
                        {height}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 编辑器设置 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary-500" />
                <h3 className="text-lg font-medium">编辑器</h3>
              </div>
              
              <div className="space-y-4 ml-6">
                {/* 自动换行 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">自动换行</label>
                  <button
                    onClick={() => updateSettings({ wordWrap: !settings.wordWrap })}
                    className={clsx(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.wordWrap ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                        settings.wordWrap ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* 显示行号 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">显示行号</label>
                  <button
                    onClick={() => updateSettings({ showLineNumbers: !settings.showLineNumbers })}
                    className={clsx(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.showLineNumbers ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                        settings.showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* Tab 大小 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Tab 大小</label>
                  <select
                    value={settings.tabSize}
                    onChange={(e) => updateSettings({ tabSize: Number(e.target.value) })}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    {tabSizes.map(size => (
                      <option key={size} value={size}>
                        {size} 空格
                      </option>
                    ))}
                  </select>
                </div>

                {/* 自动编号 */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">标题自动编号</label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">为标题添加层级编号</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoNumberHeadings: !settings.autoNumberHeadings })}
                    className={clsx(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.autoNumberHeadings ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                        settings.autoNumberHeadings ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* 自动保存 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">自动保存</label>
                  <button
                    onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                    className={clsx(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.autoSave ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                        settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* 自动保存间隔 */}
                {settings.autoSave && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">自动保存间隔</label>
                    <select
                      value={settings.autoSaveInterval}
                      onChange={(e) => updateSettings({ autoSaveInterval: Number(e.target.value) })}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value={10000}>10秒</option>
                      <option value={30000}>30秒</option>
                      <option value={60000}>1分钟</option>
                      <option value={300000}>5分钟</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 快捷键说明 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Keyboard size={20} className="text-primary-500" />
                <h3 className="text-lg font-medium">快捷键</h3>
              </div>
              
              <div className="ml-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>保存文件</span>
                  <span className="font-mono">Ctrl/Cmd + S</span>
                </div>
                <div className="flex justify-between">
                  <span>搜索</span>
                  <span className="font-mono">Ctrl/Cmd + F</span>
                </div>
                <div className="flex justify-between">
                  <span>切换大纲</span>
                  <span className="font-mono">Ctrl/Cmd + \</span>
                </div>
                <div className="flex justify-between">
                  <span>粗体</span>
                  <span className="font-mono">Ctrl/Cmd + B</span>
                </div>
                <div className="flex justify-between">
                  <span>斜体</span>
                  <span className="font-mono">Ctrl/Cmd + I</span>
                </div>
                <div className="flex justify-between">
                  <span>链接</span>
                  <span className="font-mono">Ctrl/Cmd + K</span>
                </div>
                <div className="flex justify-between">
                  <span>行内代码</span>
                  <span className="font-mono">Ctrl/Cmd + `</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 btn btn-primary"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 