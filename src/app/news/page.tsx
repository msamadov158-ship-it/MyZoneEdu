'use client'
import Link from 'next/link'
import Image from 'next/image'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { CalendarDays, ChevronRight, FileText, Newspaper, Sparkles, TrendingUp, Mail } from 'lucide-react'
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

    const [featured, ...rest] = newsList
    const trending = rest.slice(0, 3)
    const recommended = rest.slice(3, 5)

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
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
                    {/* Main column */}
                    <div className="xl:col-span-8 flex flex-col gap-12">
                        {/* Featured / Latest article */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link href={`/news/${featured.id}`} className="group block">
                                <article className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#a20000]/10 border border-[#f0d5d3] bg-white transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#a20000]/20">
                                    <div className="relative h-[420px] w-full overflow-hidden">
                                        {featured.image_url ? (
                                            <Image
                                                src={featured.image_url}
                                                alt={featured.title}
                                                fill
                                                priority
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 1280px) 100vw, 66vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#a20000] to-[#d00000] flex items-center justify-center">
                                                <Newspaper className="w-24 h-24 text-white opacity-40" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                        <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                                            <Sparkles className="w-3.5 h-3.5 text-[#a20000]" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-[#a20000]">
                                                So'nggi yangilik
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-2 max-w-3xl">
                                                {featured.title}
                                            </h2>
                                            <p className="text-white/80 mb-5 line-clamp-2 max-w-2xl">
                                                {featured.description || featured.content?.slice(0, 180) + '...'}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-white/70">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="w-4 h-4" />
                                                        <time>
                                                            {featured.created_at ? formatDistanceToNow(new Date(featured.created_at), { locale: uz }) : 'Yangi'} oldin
                                                        </time>
                                                    </div>

                                                    {featured.file_url && (
                                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                                            <FileText className="w-4 h-4" />
                                                            <span>Fayl bor</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div title="Batafsil o'qish" className="group/btn inline-flex items-center rounded-full bg-gradient-to-b from-[#d00000] to-[#a20000] px-5 py-2.5 shadow-lg transition-transform duration-300 hover:scale-105">
                                                    <span className="text-sm font-semibold text-white mr-2">
                                                        Batafsil o'qish
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-white transition-transform duration-300 group-hover/btn:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>

                        {/* Rest of the news grid */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
                            {rest.map((news) => (
                                <Link href={`/news/${news.id}`} key={news.id} className="group block">
                                    <motion.article
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#a20000]/30 group-hover:-translate-y-2 border-2 border-gray-100 group-hover:border-[#a20000]"
                                    >
                                        {/* Rasm */}
                                        <div className="relative h-56 overflow-hidden">
                                            {news.image_url ? (
                                                <Image
                                                    src={news.image_url}
                                                    alt={news.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#a20000] to-[#d00000] flex items-center justify-center">
                                                    <Newspaper className="w-20 h-20 text-white opacity-40" />
                                                </div>
                                            )}

                                            {/* linear overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#a20000] transition-colors">
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

                                                <div title="Batafsil o'qish" className="group inline-flex items-center rounded-full border border-[#f0d5d3] px-3 py-2 transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-[#d00000] group-hover:to-[#a20000] hover:scale-110">
                                                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:mr-2 text-white">
                                                        Batafsil o'qish
                                                    </span>

                                                    <ChevronRight className="h-5 w-5 text-[#a20000] transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    {/* Sidebar / right column */}
                    <aside className="xl:col-span-4 flex flex-col gap-8">
                        {/* Trending Now */}
                        {trending.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <TrendingUp className="w-5 h-5 text-[#a20000]" />
                                    <h3 className="text-lg font-bold text-gray-900">Ko'p o'qilganlar</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {trending.map((news, idx) => (
                                        <Link
                                            href={`/news/${news.id}`}
                                            key={news.id}
                                            className={`flex gap-4 group ${idx > 0 ? 'pt-4 border-t border-gray-100' : ''}`}
                                        >
                                            <span className="text-3xl font-extrabold leading-none text-gray-200 shrink-0">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-[#a20000] transition-colors line-clamp-2">
                                                    {news.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {news.created_at ? formatDistanceToNow(new Date(news.created_at), { locale: uz }) : 'Yangi'} oldin
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommended reading */}
                        {recommended.length > 0 && (
                            <div className="bg-red-50/40 rounded-2xl border border-gray-100 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#a20000]/5 rounded-bl-full -z-10" />
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Sizga tavsiya etamiz</h3>
                                <div className="flex flex-col gap-3">
                                    {recommended.map((news) => (
                                        <Link
                                            href={`/news/${news.id}`}
                                            key={news.id}
                                            className="bg-white p-3 rounded-xl border border-gray-100 hover:border-[#a20000]/30 transition-colors flex items-start gap-3 group"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                                {news.image_url ? (
                                                    <Image
                                                        src={news.image_url}
                                                        alt={news.title}
                                                        fill
                                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#a20000] to-[#d00000] flex items-center justify-center">
                                                        <Newspaper className="w-6 h-6 text-white opacity-60" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900 leading-snug group-hover:text-[#a20000] transition-colors line-clamp-3">
                                                {news.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Newsletter CTA */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 text-center flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-linear-to-b from-[#d00000] to-[#a20000] flex items-center justify-center mb-3">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Yangiliklardan xabardor bo'ling</h3>
                            <p className="text-sm text-gray-500 mb-5">
                                Har hafta eng so'nggi yangiliklar va foydali maslahatlar emailingizga keladi.
                            </p>
                            <div className="w-full flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Email manzilingiz"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#a20000] focus:ring-1 focus:ring-[#a20000] outline-none"
                                />
                                <button className="w-full bg-linear-to-b from-[#d00000] to-[#a20000] text-white font-semibold py-2.5 rounded-lg text-sm transition-opacity hover:opacity-90">
                                    Obuna bo'lish
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    )
}