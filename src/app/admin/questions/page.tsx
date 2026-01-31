'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { fadeUp, staggeredList } from '@/lib/motion'

export default function Questions() {
	const router = useRouter()
	const { loading, courses } = useCourses()

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Kurslar yuklanmoqda...</p>
					</div>
				</motion.div>
			) : courses.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
					<p className="text-gray-600 mb-4">Birinchi kursni qo‘shish orqali boshlang</p>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Barcha kurslar</h2>
							<p className="text-gray-600 mt-1">Ta&apos;lim kontentingizni boshqaring</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{courses.map((course, index) => (
							<motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
								<div className="relative h-56 bg-myZoneOnline overflow-hidden">
									{course.image_url ? (
										<Image src={course.image_url} alt={course.title} width={100} height={100} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<BookOpen className="w-12 h-12 text-white opacity-80" />
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>

								<div className="p-5">
									<div className="flex items-center justify-between mb-3">
										<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{course.level || 'Umumiy'}</span>
									</div>

									<h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>

									<p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description?.slice(0, 50) || 'Tavsif mavjud emas'}</p>

									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<motion.button onClick={() => router.push(`/admin/questions/${course.id}/modules`)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
											Tafsilotlarni ko‘rish
										</motion.button>
									</div>
								</div>

								<div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
