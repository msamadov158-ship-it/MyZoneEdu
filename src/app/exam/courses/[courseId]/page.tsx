'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, CheckCircle, Share2, Bookmark, ArrowLeft, Loader2, Video, Play } from 'lucide-react'
import { CourseEdit } from '@/types'
import { useCourse } from '@/hooks/useCourse'
import { useCourses } from '@/hooks/useCourses'
import { useCourseSave } from '@/hooks/useCourseSave'
import { useCourseContent } from '@/hooks/useCourseContent'
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
	teacher: {
		full_name: string
		phone_number: string
	}
	calendar_event_id: string
}

export default function Courses() {
	const router = useRouter()
	const { courseId } = useParams<{ courseId: string }>()
	const { fetchCourse } = useCourses()
	const { contents, count } = useCourseContent(courseId)
	const { modules, fetchModules, loading } = useCourse(courseId)
	const userId = getUserFromStorage()?.user_id
	const { isSaved, loading: saveLoading, toggleSave } = useCourseSave(userId as string)
	const [course, setCourse] = useState<CourseEdit | null>(null)
	const [meetingInfo, setMeetingInfo] = useState<MeetingInfo[]>([])
	const [meetingLoading, setMeetingLoading] = useState(true)
	const [openId, setOpenId] = useState<string | null>(null)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const handleToggle = (id: string) => {
		setOpenId((prev) => (prev === id ? null : id))
	}

	useEffect(() => {
		const loadCourse = async () => {
			const res = await fetchCourse(courseId)
			if (res) setCourse(res)
		}
		loadCourse()
	}, [courseId, fetchCourse])

	useEffect(() => {
		const loadModules = async () => {
			await fetchModules()
		}
		loadModules()
	}, [courseId, fetchModules])

	useEffect(() => {
		const loadMeetingInfo = async () => {
			setMeetingLoading(true)
			try {
				const res = await API.get(`/api/meeting_lesson/${courseId}`)
				setMeetingInfo(res.data.result || [])
			} catch (err) {
				toast.error("Meeting ma'lumotlarini yuklashda xatolik!")
			} finally {
				setMeetingLoading(false)
			}
		}
		loadMeetingInfo()
	}, [courseId])

	if (loading || !course) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg font-medium">Kurs mazmuni yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
			<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
				<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
							<BookOpen className="w-5 h-5 text-blue-600" />
							Kurs modullaridan birini tanlang
						</h2>
						<p className="text-gray-600 text-sm mt-1">
							{count.course_module_count} modul
						</p>
					</div>
					<div className="divide-y divide-gray-200">
						{modules.map((module, index) => (
							<motion.div key={module.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-white">
								<button onClick={() => router.push(`${courseId}/module/${module.id}`)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-300 group">
									<div className="flex items-center gap-4 flex-1 text-left">
										<div className="w-10 h-10 bg-myZoneOnline rounded-xl flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{module.title}</h3>
											<p className="text-gray-600 text-sm mt-1 line-clamp-2">{module.description}</p>
										</div>
									</div>
								</button>
								<div className="flex justify-end ps-6 p-4 border-t border-gray-100">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="px-4 py-2 bg-myZoneOnline text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium "
										onClick={(e) => {
											e.stopPropagation()
											router.push(`${courseId}/module/${module.id}`)
										}}
									>
										<Play className="w-4 h-4" />
										Testga o&apos;tish
									</motion.button>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</motion.div>
		</div>
	)
}
