'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTypes } from '@/hooks/useTypes'
import { useCourses } from '@/hooks/useCourses'
import { useCourseSave } from '@/hooks/useCourseSave'
import { motion, AnimatePresence } from 'framer-motion'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { containerVariants, itemVariants } from '@/lib/motion'
import { BookOpen, Play, Search, Grid, List, Bookmark, Share2, Loader2, CheckCircle } from 'lucide-react'

export default function StudentDashboard() {
	const router = useRouter()
	const userId = getUserFromStorage()?.user_id

	const { types } = useTypes()
	const { savedCourses } = useCourseSave(userId as string)
	const typeId = getUserFromStorage()?.type_id
	const { courses, loading, fetchCourses } = useCourses()

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [selectedCategory, setSelectedCategory] = useState(typeId)

	useEffect(() => {
		fetchCourses()
	}, [fetchCourses])

	const stats = {
		enrolled: 12,
		completed: 3,
		inProgress: 5,
		hoursSpent: 48,
	}

	const { isSaved, loading: saveLoading, toggleSave } = useCourseSave(userId as string)

	const filteredCourses = selectedCategory === 'saved' ? savedCourses : courses?.filter((course) => course.type_id === selectedCategory && course.type_id === typeId)

	return (
		<div className="max-w-7xl mx-auto space-y-8">
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
				<div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Mening o‘quv panelim</h1>
					<p className="text-gray-600 text-lg">O‘rganishni davom ettiring va yangi kurslarni kashf eting</p>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
						<button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-myZoneOnline text-white shadow-md' : 'text-gray-600 hover:text-blue-600'}`}>
							<Grid className="w-5 h-5" />
						</button>
						<button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-myZoneOnline text-white shadow-md' : 'text-gray-600 hover:text-blue-600'}`}>
							<List className="w-5 h-5" />
						</button>
					</div>
				</div>
			</motion.div>

			{/* Qidiruv va kategoriyalar */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
				<div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
					<div className="relative flex-1 max-w-md">
						<Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input type="text" placeholder="Kurslarni qidirish..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm" />
					</div>

					<div className="flex items-center gap-2 overflow-x-auto pb-2">
						<button onClick={() => setSelectedCategory('saved')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === 'saved' ? 'bg-myZoneOnline text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
							Saqlanganlar
						</button>

						{types.map((type) => (
							<button key={type.id} onClick={() => setSelectedCategory(type.id)} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === type.id ? 'bg-myZoneOnline text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
								{type.title}
							</button>
						))}
					</div>
				</div>
			</motion.div>

			{/* Yuklanish holati */}
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
				<motion.div variants={containerVariants} animate="visible" className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
					<AnimatePresence>
						{filteredCourses?.map((course, idx) => {
							const currentStatus = isSaved(course.id)

							return (
								<motion.div key={idx} variants={itemVariants} layout whileHover={{ y: -5, scale: 1.02 }} className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
									<div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
										<div onClick={() => router.push(`/student/courses/${course.id}`)} className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${course.image_url})` }} />

										<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<button onClick={() => toggleSave(course.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
												{saveLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : currentStatus ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Bookmark className="w-5 h-5" />}
											</button>

											<button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
												<Share2 className="w-4 h-4" />
											</button>
										</div>
									</div>

									<div className="p-6 flex-1">
										<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">{course.level || 'Umumiy'}</span>

										<h3 onClick={() => router.push(`/student/courses/${course.id}`)} className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
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
													router.push(`student/courses/${course.id}`)
												}}
											>
												<Play className="w-4 h-4" />
												Davom etish
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
