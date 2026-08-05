'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, CheckCircle, Lock, Clock, XCircle } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/motion'
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

    const [moduleTests, setModuleTests] = useState<ModuleTestItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        async function fetchModuleTests() {
            try {
                setLoading(true)
                const res = await API.get('/api/module_test/list/action')
                console.log(res);
                

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

    // loading new design
    if (loading) {
    return (
        <div className="max-w-7xl mx-auto py-12 h-190 lg:h-dvh flex justify-center items-center">
            <div className="relative w-full lg:w-[calc(100%-200px)] flex items-center justify-center h-64 rounded-2xl overflow-hidden
                             bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
                {/* ambient glow accents */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

                <div className="relative text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#a20000]/15" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-[#a20000] border-r-[#d00000] border-b-transparent border-l-transparent animate-spin" />
                    </div>
                    <p className="text-gray-600">
                        Test modullari yuklanmoqda...
                    </p>
                </div>
            </div>
        </div>
    )
}

    // test yuq yangi design
    if (!loading && moduleTests.length === 0) {
    return (
        <div className="max-w-7xl mx-auto py-12 h-dvh flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-[calc(100%-200px)] text-center py-16 px-8 rounded-2xl overflow-hidden
                           bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]"
            >
                {/* ambient glow accents */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                    className="relative w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center
                               bg-linear-to-br from-[#a20000] to-[#d00000] shadow-lg shadow-[#a20000]/30"
                >
                    <BookOpen className="w-11 h-11 text-white" />
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="relative text-2xl font-bold bg-linear-to-r from-[#a20000] to-[#d00000] bg-clip-text text-transparent mb-3"
                >
                    Hozircha test modullari yo&apos;q
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="relative text-gray-500 text-lg"
                >
                    Tez orada yangi modullar qo&apos;shiladi
                </motion.p>
            </motion.div>
        </div>
    )
}

    return (
        <div className="max-w-7xl mx-auto space-y-4 p-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Imtihonlar
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
                    className={`group relative rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 backdrop-blur-xl ${
                        is_open && !is_passed
                            ? 'bg-white/80 border-[#a20000]/15 hover:border-[#d00000]/40 hover:shadow-2xl hover:shadow-[#a20000]/10'
                            : is_passed
                            ? 'bg-green-50/50 border-green-200'
                            : 'bg-white/60 border-gray-200 opacity-75'
                    }`}
                >
                    
                        <div className="relative h-48 overflow-hidden bg-linear-to-br from-red-500 via-red-600 to-red-700">
                        
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-gray-900/20 to-transparent" />

                        {is_passed ? (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-green-500 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg ring-1 ring-black/5">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                Yakunlangan
                            </div>
                        ) : (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-red-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg ring-1 ring-black/5">
                                <XCircle className="w-3.5 h-3.5 text-gray-400" />
                                Yakunlanmagan
                            </div>
                        )}
                        </div>
                    

                    <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 ">
                            {module.title}{' '}
                            <span className={`text-sm  px-2 py-0.5 rounded-full ml-2 ${is_passed ? `text-green-500 bg-green-200` : `text-red-700 bg-red-200` }`}>
                                {module.order === 5 ? 'Oraliq nazorat imtihoni' : 'Yakuniy nazorat imtihoni'}
                            </span>
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
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push(`/exam/${module.id}`)}
                                    className="px-6 py-3 bg-linear-to-r from-[#a20000] to-[#d00000] text-white rounded-xl shadow-lg shadow-[#a20000]/25 hover:shadow-[#a20000]/40 transition-all flex items-center gap-2 font-medium"
                                >
                                    <Play className="w-4 h-4" />
                                    Testga o&apos;tish
                                </motion.button>
                            ) : (
                                <button disabled className="px-6 py-3 bg-gray-200/80 text-gray-500 rounded-xl cursor-not-allowed flex items-center gap-2 font-medium">
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
