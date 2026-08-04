'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import LessonVideo from './LessonVideo'
import { LessonPayload } from '@/types'
import MaterialTemplate from './Material'
import { useLessons } from '@/hooks/useLessons'

import { useCourses } from '@/hooks/useCourses'
import { CourseEdit } from '@/types'


export default function LessonDetail() {
	const router = useRouter()
	const { lessonId } = useParams<{ lessonId: string }>()
	
	const { fetchLesson } = useLessons()

	const [lesson, setLesson] = useState<LessonPayload | null>(null)
	const [loading, setLoading] = useState(true)

	const [course, setCourse] = useState<CourseEdit | null>(null)
	const { courseId } = useParams<{ courseId: string }>()
	const { fetchCourse } = useCourses()

	useEffect(() => {
		const loadCourse = async () => {
			const res = await fetchCourse(courseId)
			if (res) setCourse(res)
				console.log(res);
		}
		loadCourse()
	}, [courseId, fetchCourse])

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
					<p className="text-gray-600 font-medium">Darslarni yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	if (!lesson) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<p className="text-gray-600 font-medium">Darslar topilmadi</p>
			</div>
		)
	}

	return (
		<div>
			<header className="bg-white shadow-sm border-b border-gray-300">
				<div className="max-w-full mx-auto px-4 py-4 flex items-center gap-3">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-red-700 shrink-0">
						<ArrowLeft className="w-5 h-5" />
					</button>

					<div className="flex flex-col min-w-0 lg:flex-row lg:items-baseline gap-1 lg:gap-3">
					<h1 className="text-lg lg:text-2xl font-semibold text-red-700 whitespace-nowrap">
						My Zone Online
					</h1>
					<p className="text-gray-400 text-sm lg:text-base truncate m-0">
							/ {course?.title} / {lesson.title}
					</p>
					</div>
				</div>
				</header>

			<div className="max-w-7xl w-full mx-auto py-8 pt-0">
				<div className="grid grid-cols-1 gap-8">
					<div className="lg:col-span-2 bg-white shadow-sm  p-6">
						<div className="relative aspect-video mb-6 overflow-hidden bg-gray-800 rounded-xl">
							<LessonVideo lesson={lesson} />
						</div>

						<h2 className="text-2xl font-bold text-gray-900 mb-3">{lesson.title}</h2>
						<p className="text-gray-600 mb-4">{lesson.description}</p>

						<button onClick={() => router.push(`${lessonId}/test`)} className="relative overflow-hidden cursor-pointer group px-6 py-4 rounded-lg font-semibold text-md text-white bg-red-600 shadow-[0_10px_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(79,70,229,0.45)] active:scale-[0.98]">
							<span className="absolute inset-0 bg-red-300  to-transparent blur-xl -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
							<span className="relative z-10 flex items-center gap-2">Dars yakuniy testi</span>
						</button>

						<MaterialTemplate lessonId={lessonId} />
					</div>
				</div>
			</div>
		</div>
	)
}
