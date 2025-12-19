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
	const { lessonId } = useParams<{ lessonId: string }>()
	const { fetchLesson } = useLessons()

	const [lesson, setLesson] = useState<LessonPayload | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			try {
				const res = await fetchLesson(lessonId)
				setLesson(res || null)
			} catch (err) {
				console.error('Error loading lesson:', err)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [lessonId, fetchLesson])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">Loading lesson...</p>
				</div>
			</div>
		)
	}

	if (!lesson) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<p className="text-gray-600 font-medium">Lesson not found.</p>
			</div>
		)
	}

	return (
		<div>
			<header className="bg-white shadow-sm border-b border-gray-300">
				<div className="max-w-full mx-auto px-4 py-4 flex items-center gap-4">
					<button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
				</div>
			</header>

			<div className="max-w-7xl w-full mx-auto py-8">
				<div className="grid grid-cols-1 gap-8">
					<div className="lg:col-span-2 bg-white shadow-sm rounded-2xl p-6">
						<div className="relative aspect-video mb-6 overflow-hidden bg-gray-800 rounded-xl">
							<LessonVideo lesson={lesson} />
						</div>

						<h2 className="text-2xl font-bold text-gray-900 mb-3">{lesson.title}</h2>
						<p className="text-gray-600 mb-4">{lesson.description}</p>

						<button onClick={() => router.push(`${lessonId}/test`)} className="relative overflow-hidden group px-6 py-4 rounded-xl font-semibold text-md text-white bg-myZoneOnline shadow-[0_10px_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(79,70,229,0.45)] active:scale-[0.98]">
							<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
							<span className="relative z-10 flex items-center gap-2">🧠 Lesson Test</span>
						</button>

						<MaterialTemplate lessonId={lessonId} />
					</div>
				</div>
			</div>
		</div>
	)
}
