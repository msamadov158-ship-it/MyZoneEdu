'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import LessonVideo from './LessonVideo'
import MaterialTemplate from './Material'
import { LessonPayload } from '@/types'
import { useLessons } from '@/hooks/useLessons'

export default function LessonDetail() {
	const router = useRouter()
	const [lesson, setLesson] = useState<LessonPayload | null>(null)
	const { lessonId } = useParams<{ lessonId: string }>()
	const { fetchLesson } = useLessons()

	useEffect(() => {
		const load = async () => {
			const res = await fetchLesson(lessonId)
			setLesson(res || null)
		}
		load()
	}, [])

	return (
		<div>
			<header className="bg-white shadow-sm border-b border-gray-300">
				<div className="max-w-full mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
								<ArrowLeft className="w-5 h-5" />
							</button>
							<h1 className="text-2xl font-bold text-gray-900">{lesson?.title}</h1>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl w-full mx-auto py-8 ">
				<div className="grid grid-cols-1 gap-8 ">
					<div className="lg:col-span-2">
						<div className="bg-white shadow-sm">
							<div className="relative aspect-video mb-6 overflow-hidden bg-gray-800">
								<LessonVideo lesson={lesson} />
							</div>

							<div className="p-6">
								<h2 className="text-2xl font-bold text-gray-900 mb-3">{lesson?.title}</h2>
								<p className="text-gray-600 mb-4">{lesson?.description}</p>
								<button onClick={() => router.push(`${lessonId}/test`)} className="cursor-pointer relative overflow-hidden group px-6 py-4 rounded-xl font-semibold text-md whitespace-nowrap text-white bg-myZoneOnline to-purple-600 shadow-[0_10px_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(79,70,229,0.45)] active:scale-[0.98]">
									<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
									<span className="relative z-10 flex items-center gap-2">🧠 Lesson Test</span>
								</button>
							</div>

							{<MaterialTemplate lessonId={lessonId} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
