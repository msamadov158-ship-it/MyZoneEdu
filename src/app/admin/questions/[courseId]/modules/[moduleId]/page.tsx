'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useLessons } from '@/hooks/useLessons'
import { BookOpen, Clock, FileText, Play, Video } from 'lucide-react'
import { fadeUp, staggeredList } from '@/lib/motion'

export default function CourseLesson() {
	const router = useRouter()
	const { moduleId } = useParams<{ moduleId: string }>()
	const { loading, lessons } = useLessons(moduleId)

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Loading course module data...</p>
					</div>
				</motion.div>
			) : lessons.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">No course lessons found</h3>
					<p className="text-gray-600 mb-4">Get started by adding your first course module</p>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="space-y-6">
					{[...lessons]
						.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
						.map((lesson, idx) => (
							<motion.div key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 group cursor-pointer" onClick={() => router.push(`${moduleId}/questions/${lesson.id}`)}>
								<div className="flex flex-col lg:flex-row gap-6">
									<div className="flex-1 min-w-0">
										<div className="flex flex-col h-full">
											<div className="flex items-start justify-between gap-4 mb-3">
												<div className="flex-1 min-w-0">
													<h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{lesson.title}</h5>

													{lesson.description && <p className="text-gray-600 mt-2 line-clamp-2">{lesson.description}</p>}
												</div>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						))}
				</motion.div>
			)}
		</motion.div>
	)
}
