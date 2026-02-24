'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Play, CheckCircle, Lock, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/motion'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import API from '@/lib/axios'

interface ModuleTestItem {
    is_open: boolean
    is_passed: boolean
    module: {
        id: number
        course_id: number
        title: string
        description: string
        created_at: string
        is_active: boolean
        order: number
    }
}

export default function ModuleTestList() {
    const router = useRouter()
    const typeId = getUserFromStorage()?.type_id

    const [moduleTests, setModuleTests] = useState<ModuleTestItem[]>([])
    const [loading, setLoading] = useState(true)

    // ===============================
    // FETCH DATA
    // ===============================
    useEffect(() => {
        let mounted = true

        async function fetchModuleTests() {
            try {
                setLoading(true)
                const res = await API.get('/api/module_test/list/action')

                if (mounted) {
                    setModuleTests(res.data?.result || [])
                }
            } catch (err) {
                console.error('Module testlarni yuklashda xatolik:', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchModuleTests()

        return () => {
            mounted = false
        }
    }, [])

    // ===============================
    // DERIVED VALUE (STATE EMAS)
    // ===============================
    const finished = useMemo(() => {
        return moduleTests.some(item => item.module.order === 5)
    }, [moduleTests])

    // ===============================
    // LOADING UI
    // ===============================
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12">
                <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">
                            Test modullari yuklanmoqda...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // ===============================
    // EMPTY UI
    // ===============================
    if (!loading && moduleTests.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Hozircha test modullari yo'q
                    </h3>
                    <p className="text-gray-600 text-lg">
                        Tez orada yangi modullar qo'shiladi
                    </p>
                </motion.div>
            </div>
        )
    }

    // ===============================
    // MAIN UI
    // ===============================
    return (
        <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    {finished ? 'Oraliq nazorat imtixoni' : 'Yakuniy nazorat imtixoni'}
                </h1>

                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    Jami: {moduleTests.length} ta modul
                </span>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {moduleTests.map((item) => {
                        const { module, is_open, is_passed } = item

                        return (
                            <motion.div
                                layout
                                key={module.id}
                                variants={itemVariants}
                                whileHover={is_open && !is_passed ? { y: -8, scale: 1.03 } : {}}
                                className={`group bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${is_open && !is_passed ? 'border-blue-200 hover:border-blue-400 hover:shadow-2xl' : is_passed ? 'border-green-200 bg-green-50/30' : 'border-gray-200 opacity-75'}`}
                            >
                                {is_passed && (
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
                                            <CheckCircle className="w-4 h-4" />
                                            Yakunlangan
                                        </div>
                                    </div>
                                )}

                                <div className="p-6">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                                        {module.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                                        {module.description || 'Tavsif mavjud emas'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    {new Date(module.created_at).toLocaleDateString('uz-UZ')}
                                                </span>
                                            </div>
                                        </div>

                                        {is_passed ? (
                                            <div className="text-green-600 font-medium flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                Muvaffaqiyatli!
                                            </div>
                                        ) : is_open ? (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95, }}
                                                onClick={() => router.push(`/exam/${module.id}`)}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium"
                                            >
                                                <Play className="w-4 h-4" />
                                                Testga o'tish
                                            </motion.button>
                                        ) : (
                                            <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed flex items-center gap-2 font-medium">
                                                <Lock className="w-4 h-4" />
                                                Yopiq
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
