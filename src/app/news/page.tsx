'use client'
import Link from 'next/link'
import Image from 'next/image'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CalendarDays, ChevronRight, FileText, Newspaper } from 'lucide-react'
import { useNews } from '@/hooks/useNews'

export default function NewsPage() {
    const { loading, newsList } = useNews()

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse h-96" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    Yangiliklar va e&apos;lonlar
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Eng so'nggi yangiliklar, voqealar va muhim ma'lumotlar bilan tanishing
                </p>
            </div>

            {newsList.length === 0 ? (
                <div className="text-center py-24">
                    <Newspaper className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                        Hozircha yangiliklar yo&apos;q
                    </h2>
                    <p className="text-gray-500">Tez orada yangi maqolalar bilan qaytamiz!</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                >
                    {newsList.map((news) => (
                        <Link href={`/news/${news.id}`} key={news.id} className="group block">
                            <motion.article
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-700 group-hover:-translate-y-2 border-2 group-hover:border-red-500 group-hover:text-red-600 border border-gray-100"
                            >
                                {/* Rasm */}
                                <div className="relative h-56 overflow-hidden">
                                    {news.image_url ? (
                                        <Image
                                            src={news.image_url}
                                            alt={news.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center">
                                            <Newspaper className="w-20 h-20 text-white opacity-40" />
                                        </div>
                                    )}

                                    {/* linear overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {news.title}
                                    </h2>

                                    <p className="text-gray-600 mb-5 line-clamp-4">
                                        {news.description || news.content?.slice(0, 150) + '...'}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4" />
                                                <time>
                                                    {news.created_at ? formatDistanceToNow(new Date(news.created_at), { locale: uz }) : 'Yangi'} oldin
                                                </time>
                                            </div>

                                            {news.file_url && (
                                                <div className="flex items-center gap-1.5 text-emerald-600">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Fayl bor</span>
                                                </div>
                                            )}
                                        </div>

                                        <div title="Batafsil o'qish" className="group inline-flex items-center rounded-full border border-red-200 px-3 py-2 transition-all duration-300 group-hover:bg-red-600 hover:scale-110">
                                            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:mr-2 text-white">
                                                Batafsil o'qish
                                            </span>

                                            <ChevronRight className="h-5 w-5 text-red-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
