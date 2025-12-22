'use client'
import { ArrowLeft, Clock } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useLessons } from '@/hooks/useLessons'

export default function Lessons() {
	const router = useRouter()
	const { moduleId } = useParams<{ courseId: string; moduleId: string }>()
	const { lessons } = useLessons(moduleId)

	return (
		<AnimatePresence>
			<div>
				<motion.header initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white shadow-sm border-b border-gray-300">
					<div className="max-w-full mx-auto px-4 py-4">
						<div className="flex items-center gap-4">
							<button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
								<ArrowLeft className="w-5 h-5" />
							</button>
							<h1 className="text-2xl font-bold text-gray-900">O‘rganish Platformasi</h1>
						</div>
					</div>
				</motion.header>

				<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="py-6">
					<div className="space-y-3">
						{lessons.map((lesson, idx) => (
							<motion.div key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: idx * 0.05 }} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group bg-white ${lesson.lesson_test_progress === null ? 'border-gray-200' : lesson.lesson_test_progress.is_completed ? 'border-green-500' : 'border-blue-300'}`}>
								<div className="p-2 rounded-lg bg-gray-200 text-gray-400">
									<span>🎬</span>
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
									</div>
									<div className="flex items-center gap-4 text-sm">
										<span className="flex items-center gap-1 text-gray-400">
											<Clock className="w-3 h-3" />
											{lesson.duration} daq
										</span>
									</div>
								</div>

								{lesson.lesson_test_progress !== null && (
									<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push(`lessons/${lesson.id}`)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 bg-blue-100 text-blue-700 hover:bg-blue-200">
										Boshlash
									</motion.button>
								)}
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	)
}
