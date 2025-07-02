import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import clsx from 'clsx'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // 添加toast
  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // 自动移除
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)
  }

  // 移除toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // 监听全局toast事件
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type, duration } = event.detail
      addToast({ message, type: type || 'info', duration })
    }

    window.addEventListener('showToast', handleToast as EventListener)
    
    return () => {
      window.removeEventListener('showToast', handleToast as EventListener)
    }
  }, [])

  // 获取图标
  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <XCircle size={20} />
      case 'warning':
        return <AlertCircle size={20} />
      default:
        return <AlertCircle size={20} />
    }
  }

  // 获取样式类
  const getToastClass = (type: ToastItem['type']) => {
    const baseClass = 'flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-lg transition-all duration-300 ease-in-out transform hover:scale-105'
    
    switch (type) {
      case 'success':
        return clsx(baseClass, 'bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 border-success-200 dark:border-success-700 text-success-800 dark:text-success-200')
      case 'error':
        return clsx(baseClass, 'bg-gradient-to-r from-error-50 to-error-100 dark:from-error-900/30 dark:to-error-800/30 border-error-200 dark:border-error-700 text-error-800 dark:text-error-200')
      case 'warning':
        return clsx(baseClass, 'bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 border-warning-200 dark:border-warning-700 text-warning-800 dark:text-warning-200')
      default:
        return clsx(baseClass, 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border-primary-200 dark:border-primary-700 text-primary-800 dark:text-primary-200')
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={clsx(
            getToastClass(toast.type),
            'animate-slide-down'
          )}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {toast.message}
            </p>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
} 