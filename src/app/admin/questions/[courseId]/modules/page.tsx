'use client'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useCourse } from '@/hooks/useCourse'
import { fadeUp, staggeredList } from '@/lib/motion'

export default function CourseModule() {
	const router = useRouter()
	const { courseId } = useParams<{ courseId: string }>()
	const { loading, modules } = useCourse(courseId)

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Loading course module data...</p>
					</div>
				</motion.div>
			) : modules.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">No course modules found</h3>
					<p className="text-gray-600 mb-4">Get started by adding your first course module</p>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="space-y-6">
					{[...modules]
						.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
						.map((module) => (
							<motion.div key={module.id} layout className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-2 transition-all duration-300 hover:shadow-xl" onClick={() => router.push(`modules/${module.id}`)}>
								<div className="p-4 md:p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50">
									<div className="flex items-start justify-between">
										<div className="flex flex-col md:flex-row items-start gap-4 flex-1">
											<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">{module.order}</div>

											<div className="flex-1 min-w-0">
												<h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
												<p className="text-gray-600 mt-2">{module.description}</p>
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
