'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { CalendarDays, Download, ArrowLeft, Clock } from 'lucide-react'
import { useNews } from '@/hooks/useNews'

interface NewsItem {
    id: string
    title: string
    description?: string
    content?: string
    image_url?: string
    file_url?: string
    created_at?: string
}

export default function NewsDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { fetchNewsItem } = useNews()

    const [news, setNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const load = async () => {
            setLoading(true)
            try {
                const data = await fetchNewsItem(id as string)
                setNews(data as NewsItem)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, fetchNewsItem])

    const handleDownload = () => {
        if (!news?.file_url) return
        const link = document.createElement('a')
        link.href = news.file_url
        link.download = ''
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Yangilik topilmadi</h1>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:scale-105 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga qaytish
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b flex  from-gray-50 to-white rounded-2xl overflow-hidden">
            {/* <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                {news.image_url ? (
                    <Image src={news.image_url} alt={news.title} fill className="object-cover brightness-[0.85]" priority />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" />
                )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                        {news.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5" />
                            <time>
                                {news.created_at ? format(new Date(news.created_at), "d MMMM yyyy", { locale: uz }) : '—'}
                            </time>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{formatDistanceToNow(new Date(news.created_at), { locale: uz })}</span>
                        </div>
                    </div>
                </div>
            </div> */}



            {/* Content */}
            <div className="md:col-span-2 max-w-4xl mx-auto px-6 py-16">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg lg:prose-xl max-w-none"
                >
                    {news.description && (
                        <p className="text-2xl leading-relaxed text-gray-700 font-medium mb-10 border-l-4 border-indigo-500 pl-6 italic">
                            {news.description}
                        </p>
                    )}

                    {/* Asosiy matn */}
                    <div className="text-gray-800 leading-relaxed text-lg">
                        {news.content?.split('\n\n').map((para: string, i: number) => (
                            <p key={i} className="mb-8">
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Fayl yuklash */}
                    {news.file_url && (
                        <div className="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                            <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-3">
                                <Download className="w-6 h-6" />
                                Qo‘shimcha material
                            </h3>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
                            >
                                <Download className="w-5 h-5" />
                                Faylni yuklab olish
                            </button>
                        </div>
                    )}
                </motion.article>

                {/* Orqaga tugmasi */}
                <div className="mt-16 text-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition text-lg font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Barcha yangiliklarga qaytish
                    </button>
                </div>
            </div>

            <div className='hidden md:block'>
                    nimadir
            </div>
        </div>
    )
}
