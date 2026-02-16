'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Newspaper, Edit, Trash2, Download } from 'lucide-react'
import { useNews } from '@/hooks/useNews'
import { useModal } from '@/components/UI/Modal'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateNewsModal, DeleteNewsModal, EditNewsModal } from './modal'

export default function NewsPage() {
    const router = useRouter()
    const { openModal, closeModal } = useModal()
    const { loading, newsList, fetchNewsItem, createNews, updateNews, deleteNews } = useNews()

    const handleOpenCreate = () => {
        openModal({
            type: 'CREATE',
            formId: 'newsCreate',
            title: 'Yangilik Yaratish',
            btnTitle: 'Yaratish',
            content: <CreateNewsModal closeModal={closeModal} handleCreate={createNews} />,
        })
    }

    const handleOpenEdit = (id: string) => {
        openModal({
            type: 'EDIT',
            formId: 'newsEdit',
            title: 'Yangilikni Tahrirlash',
            btnTitle: 'Saqlash',
            content: <EditNewsModal id={id} closeModal={closeModal} fetchNews={fetchNewsItem} handleUpdate={updateNews} />,
        })
    }

    const handleOpenDelete = (id: string) => {
        openModal({
            type: 'DELETE',
            formId: 'newsDelete',
            title: 'Yangilikni O‘chirish',
            btnTitle: 'O‘chirish',
            content: <DeleteNewsModal id={id} closeModal={closeModal} handleDelete={deleteNews} />,
        })
    }

    // Fayl yuklab olish uchun yordamchi funksiya (ixtiyoriy – agar oddiy <a> yetarli bo'lmasa)
    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8">
            {loading ? (
                <motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Yangiliklar yuklanmoqda...</p>
                    </div>
                </motion.div>
            ) : newsList.length === 0 ? (
                <motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Yangiliklar topilmadi</h3>
                    <p className="text-gray-600 mb-4">Birinchi yangiligingizni qo‘shish orqali boshlang</p>
                    <button
                        onClick={handleOpenCreate}
                        className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:opacity-90 transition-all duration-300 shadow-lg"
                    >
                        Yangi Yangilik Qo‘shish
                    </button>
                </motion.div>
            ) : (
                <motion.div variants={fadeUp} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Barcha Yangiliklar</h2>
                            <p className="text-gray-600 mt-1">Sayt yangiliklarini boshqaring</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition hover:opacity-90"
                        >
                            Yangilik Qo‘shish
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {newsList.map((news, index) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
                            >
                                <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                                    {news.image_url ? (
                                        <Image
                                            src={news.image_url}
                                            alt={news.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Newspaper className="w-12 h-12 text-white opacity-80" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Umumiy
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {news.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {news.description?.slice(0, 80) || 'Tavsif mavjud emas'}...
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenEdit(news.id)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                                                title="Tahrirlash"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleOpenDelete(news.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="O‘chirish"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>

                                            {/* Yuklab olish tugmasi */}
                                            {news.file_url && (
                                                <a
                                                    href={news.file_url}
                                                    download={`${news.title.replace(/[^a-zA-Z0-9]/g, '_') || 'yangilik'}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1"
                                                    title="Faylni yuklab olish"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        <motion.button
                                            onClick={() => router.push(`/admin/news/${news.id}`)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                                        >
                                            Batafsil
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
