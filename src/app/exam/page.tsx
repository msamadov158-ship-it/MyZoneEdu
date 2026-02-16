'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Play } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/motion'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import API from '@/lib/axios'

export default function StudentDashboard() {
	const router = useRouter()
	const typeId = getUserFromStorage()?.type_id
	const { courses, loading } = useCourses()

	useEffect(() => {
        async function response () {
            const res = await API.get("/api/module_test/list/action")
            console.log("res", res)
        }
        response()
	}, [])

	const filteredCourses = courses?.filter((course) => course.type_id === typeId)

	return (
		<div className="max-w-7xl mx-auto space-y-8">
			{loading ? (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Kurslaringiz yuklanmoqda...</p>
					</div>
				</motion.div>
			) : filteredCourses && filteredCourses.length === 0 ? (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
					<p className="text-gray-600">Qidiruvni o‘zgartiring yoki yangi kurslarni ko‘rib chiqing</p>
				</motion.div>
			) : (
				<motion.div variants={containerVariants} animate="visible" className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}>
					<AnimatePresence>
						{filteredCourses?.map((course, idx) => {
							return (
								<motion.div key={idx} variants={itemVariants} layout whileHover={{ y: -5, scale: 1.02 }} className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden cursor-pointer`}>
									<div className='relative overflow-hidden h-48'>
										<div onClick={() => router.push(`/exam/courses/${course.id}`)} className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${course.image_url})` }} />

										<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>

									<div className="p-6 flex-1">
										<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">{course.level || 'Umumiy'}</span>

										<h3 onClick={() => router.push(`/exam/courses/${course.id}`)} className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
											{course.title}
										</h3>

										<p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'Tavsif mavjud emas'}</p>

										<div className="flex justify-end pt-4 border-t border-gray-100">
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="px-4 py-2 bg-myZoneOnline text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
												onClick={(e) => {
													e.stopPropagation()
													router.push(`exam/courses/${course.id}`)
												}}
											>
												<Play className="w-4 h-4" />
												Testga o&apos;tish
											</motion.button>
										</div>
									</div>
								</motion.div>
							)
						})}
					</AnimatePresence>
				</motion.div>
			)}
		</div>
	)
}
