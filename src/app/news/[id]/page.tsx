'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { CalendarDays, Download, ArrowLeft, Clock, Newspaper, Instagram, Send } from 'lucide-react'
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
    const { fetchNewsItem, newsList } = useNews()

    const [news, setNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

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

    const handleCopyLink = () => {
        if (typeof window === 'undefined') return
        navigator.clipboard.writeText(window.location.href)
    }

    const readTime = news?.content
        ? Math.max(1, Math.round(news.content.split(/\s+/).length / 200))
        : null

    const relatedArticles = (newsList || [])
        .filter((item) => item.id !== id)
        .slice(0, 3)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#a20000] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Yangilik topilmadi</h1>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#a20000] text-white rounded-xl hover:bg-[#d00000] hover:scale-105 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga qaytish
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            

            <div className="max-w-300 mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Article Canvas */}
                <article className="flex-1 w-full max-w-200 mx-auto md:mx-0">
                    {/* Hero */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            {readTime && (
                                <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {readTime} daqiqalik o'qish
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                            {news.title}
                        </h1>

                        {news.created_at && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 border-y border-gray-100 py-4 mb-8">
                                <CalendarDays className="w-4 h-4" />
                                <time>{format(new Date(news.created_at), 'd MMMM yyyy', { locale: uz })}</time>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(news.created_at), { locale: uz })} oldin</span>
                            </div>
                        )}

                        {news.image_url && (
                            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative mb-3">
                                <Image
                                    src={news.image_url}
                                    alt={news.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 800px) 100vw, 800px"
                                />
                            </div>
                        )}
                    </header>

                    {/* Body */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="[&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:text-6xl [&_p:first-of-type::first-letter]:leading-[0.85] [&_p:first-of-type::first-letter]:pr-2 [&_p:first-of-type::first-letter]:text-[#a20000] [&_p:first-of-type::first-letter]:font-bold"
                    >
                        {news.description && (
                            <p className="border-l-4 border-[#a20000] pl-6 my-8 italic text-2xl leading-relaxed text-gray-900">
                                {news.description}
                            </p>
                        )}

                        <div className="text-gray-700 leading-relaxed text-lg space-y-6">
                            {news.content?.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        {news.file_url && (
                            <div className="mt-12 p-8 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                                <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-3">
                                    <Download className="w-6 h-6" />
                                    Qo'shimcha material
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
                    </motion.div>

                    {/*inta*/}
                    <div className="flex justify-between items-center py-6 mt-10 border-t border-gray-100">
                        <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">Bizning ijtimoiy tarmoqlar</span>
                        <div className="flex gap-2">
                            <Link
                                href={'https://www.instagram.com/myzone_education/'}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link
                                href={'telegram'}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                <Send className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition text-lg font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Barcha yangiliklarga qaytish
                        </button>
                    </div>
                </article>

                {/* Right Rail: Related Articles only */}
                {relatedArticles.length > 0 && (
                    <aside className="hidden md:block w-[320px] shrink-0 sticky top-[24px] h-fit">
                        <h4 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
                            O'xshash maqolalar
                        </h4>
                        <div className="space-y-4">
                            {relatedArticles.map((item) => (
                                <Link href={`/news/${item.id}`} key={item.id} className="block group">
                                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
                                        <div className="h-32 w-full relative">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="320px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#a20000] to-[#d00000] flex items-center justify-center">
                                                    <Newspaper className="w-8 h-8 text-white opacity-40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h5 className="font-semibold text-gray-900 group-hover:text-[#a20000] transition-colors line-clamp-2">
                                                {item.title}
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}