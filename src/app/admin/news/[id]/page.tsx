'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Edit, Trash2, Download, Calendar, ArrowLeft, Newspaper } from 'lucide-react'
import { useNews } from '@/hooks/useNews'
import { useModal } from '@/components/UI/Modal'
import {  EditNewsModal, DeleteNewsModal } from '../modal'

export default function NewsDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const { fetchNewsItem, deleteNews, updateNews } = useNews()
    const { openModal, closeModal } = useModal()

    const [news, setNews] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadNews = async () => {
            if (!id) return
            setLoading(true)
            try {
                const data = await fetchNewsItem(id)
                if (data) {
                    setNews(data)
                } else {
                    setError("Yangilik topilmadi")
                }
            } catch (err) {
                setError("Ma'lumotni yuklashda xatolik")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadNews()
    }, [id, fetchNewsItem])

    const handleEdit = () => {
        openModal({
            type: 'EDIT',
            formId: 'newsEdit',
            title: 'Yangilikni Tahrirlash',
            btnTitle: 'Saqlash',
            content: (
                <EditNewsModal
                    id={id}
                    closeModal={closeModal}
                    fetchNews={fetchNewsItem}
                    handleUpdate={async (newsId, updatedData) => {
                        await updateNews(newsId, updatedData)
                        // yangilangan ma'lumotni qayta yuklash
                        const freshData = await fetchNewsItem(newsId)
                        if (freshData) setNews(freshData)
                    }}
                />
            ),
        })
    }

    const handleDelete = () => {
        openModal({
            type: 'DELETE',
            formId: 'newsDelete',
            title: 'Yangilikni O‘chirish',
            btnTitle: 'O‘chirish',
            content: <DeleteNewsModal id={id} closeModal={closeModal} handleDelete={deleteNews} />,
        })
    }

    const handleDownloadFile = () => {
        if (!news?.file_url) return
        const link = document.createElement('a')
        link.href = news.file_url
        link.download = `${news.title.replace(/[^a-zA-Z0-9]/g, '_') || 'yangilik'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Yangilik yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (error || !news) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md px-6">
                    <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Yangilik topilmadi</h2>
                    <p className="text-gray-600 mb-8">{error || "Bu yangilik mavjud emas yoki o'chirilgan bo'lishi mumkin."}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gray-50 pb-16 rounded-2xl overflow-hidden"
        >
            {/* Header / Hero section */}
            <div className="relative h-80 md:h-96 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden">
                {news.image_url ? (
                    <Image
                        src={news.image_url}
                        alt={news.title}
                        fill
                        className="object-cover opacity-90"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="w-32 h-32 text-white opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative h-full max-w-5xl mx-auto px-6 flex flex-col justify-end pb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        {news.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 lg:p-12">
                    {/* Qisqa tavsif */}
                    {news.description && (
                        <p className="text-xl text-gray-700 leading-relaxed mb-10 border-l-4 border-purple-500 pl-6 italic">
                            {news.description}
                        </p>
                    )}

                    {/* To'liq matn */}
                    <div className="prose prose-lg max-w-none text-gray-800">
                        {/* Agar content markdown bo'lsa → react-markdown ishlatish mumkin */}
                        {/* Hozircha oddiy text sifatida */}
                        {news.content?.split('\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="mb-6 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Qo'shimcha fayl */}
                    {news.file_url && (
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <Download className="w-6 h-6 text-emerald-600" />
                                Qo‘shimcha fayl mavjud
                            </h3>
                            <button
                                onClick={handleDownloadFile}
                                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Faylni yuklab olish
                            </button>
                        </div>
                    )}
                </div>

                {/* Admin actions */}
                <div className="mt-10 flex justify-end gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Orqaga
                    </button>

                    <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 shadow-md"
                    >
                        <Edit className="w-5 h-5" />
                        Tahrirlash
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-md"
                    >
                        <Trash2 className="w-5 h-5" />
                        O‘chirish
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
