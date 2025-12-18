'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Video, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import API from '@/lib/axios'
import { toast } from 'react-toastify'

interface MeetingInfo {
	id: number
	course_id: number
	created_at: string
	ended_at: string
	meet_url: string
	started_at: string
	status: string
	teacher_id: number
	calendar_event_id: string
}

interface CourseWithMeeting {
	id: string
	title: string
	meeting?: MeetingInfo
}

export default function TeacherCourses() {
	const router = useRouter()
	const { courses, fetchCourses, loading: coursesLoading } = useCourses()
	const [teacherId, setTeacherId] = useState<string | null>(null)
	const [activeMeetings, setActiveMeetings] = useState<Record<string, MeetingInfo>>({})
	const [loadingMeetings, setLoadingMeetings] = useState<Record<string, boolean>>({})

	useEffect(() => {
		const user = getUserFromStorage()
		if (user?.user_id && user.role === 'TEACHER') {
			// Assume role check
			setTeacherId(user.user_id)
			fetchCourses()
		} else {
			toast.error("Teacher ma'lumotlari topilmadi!")
			router.push('/auth/login')
		}
	}, [router, fetchCourses])

	const loadMeetingInfo = async (courseId: string) => {
		try {
			const res = await API.get(`/api/meeting_lesson/${courseId}`)
			return res.data.result[0] || null
		} catch (err) {
			return null
		}
	}

	useEffect(() => {
		if (courses.length > 0) {
			courses.forEach(async (course) => {
				const meeting = await loadMeetingInfo(course.id)
				if (meeting) {
					setActiveMeetings((prev) => ({ ...prev, [course.id]: meeting }))
				}
			})
		}
	}, [courses])

	const handleStartMeeting = async (courseId: string) => {
		if (!teacherId) return

		setLoadingMeetings((prev) => ({ ...prev, [courseId]: true }))
		try {
			const res = await API.post(`/api/meeting_lesson/start/${teacherId}/${courseId}`)
			const data: MeetingInfo = res.data.result
			setActiveMeetings((prev) => ({ ...prev, [courseId]: data }))
			window.open(data.meet_url, '_blank')
			toast.success('Dars boshlandi!')
		} catch (err) {
			toast.error('Darsni boshlashda xatolik!')
		} finally {
			setLoadingMeetings((prev) => ({ ...prev, [courseId]: false }))
		}
	}

	const handleFinishMeeting = async (courseId: string) => {
		const meeting = activeMeetings[courseId]
		if (!meeting) return

		setLoadingMeetings((prev) => ({ ...prev, [courseId]: true }))
		try {
			await API.post(`/api/meeting_lesson/finish/${meeting.id}`)
			setActiveMeetings((prev) => {
				const newMeetings = { ...prev }
				delete newMeetings[courseId]
				return newMeetings
			})
			toast.success('Dars tugatildi!')
		} catch (err) {
			toast.error('Darsni tugatishda xatolik!')
		} finally {
			setLoadingMeetings((prev) => ({ ...prev, [courseId]: false }))
		}
	}

	if (coursesLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg font-medium">Kurslar yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
			<div className="max-w-7xl mx-auto px-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Mening Kurslarim</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{courses.map((course) => {
						const isActive = !!activeMeetings[course.id]
						const isLoading = loadingMeetings[course.id] || false

						return (
							<motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-4">{course.title}</h3>
									<p className="text-gray-600 mb-6">{course.description.substring(0, 100)}...</p>
									{isActive ? (
										<div className="flex gap-4">
											<button onClick={() => window.open(activeMeetings[course.id].meet_url, '_blank')} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
												<Video className="w-4 h-4" />
												Join
											</button>
											<button onClick={() => handleFinishMeeting(course.id)} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
												{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
												Finish
											</button>
										</div>
									) : (
										<button onClick={() => handleStartMeeting(course.id)} disabled={isLoading} className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
											{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
											Start Lesson
										</button>
									)}
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
