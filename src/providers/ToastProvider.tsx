'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    message: string
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within ToastProvider')
    return context
}

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2000)
    }

    const iconMap = {
        success: <CheckCircle className="text-green-500" />,
        error: <XCircle className="text-red-500" />,
        info: <Info className="text-blue-500" />,
        warning: <AlertTriangle className="text-yellow-500" />,
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div key={toast.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.25 }} className={clsx('flex items-center gap-3 rounded-xl shadow-lg px-4 py-3 text-white w-[300px]', toast.type === 'success' && 'bg-green-600', toast.type === 'error' && 'bg-red-600', toast.type === 'info' && 'bg-blue-600', toast.type === 'warning' && 'bg-yellow-600 text-black')}>
                            {iconMap[toast.type]}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}