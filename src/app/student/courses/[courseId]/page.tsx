'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, CheckCircle, Share2, Bookmark, ArrowLeft, Loader2, Video } from 'lucide-react'
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

	const activeMeetings = meetingInfo.filter((meeting) => meeting.status === 'ACTIVE')

	const handleJoinMeeting = (meet_url: string) => {
		if (meet_url) {
			window.open(meet_url, '_blank')
			setIsDropdownOpen(false)
		}
	}

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

	const currentStatus = isSaved(courseId)

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
			<motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
								<ArrowLeft className="w-5 h-5" />
							</motion.button>
							<div>
								<h1 className="text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h1>
								<p className="text-gray-600 text-sm">O‘rganishni davom ettiring</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							{activeMeetings.length > 0 && (
								<div className="relative">
									<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2" disabled={meetingLoading}>
										<Video className="w-4 h-4" />
										Meetingga qo‘shilish
										<ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
									</motion.button>
									<AnimatePresence>
										{isDropdownOpen && (
											<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
												<div className="py-1">
													{activeMeetings.map((meeting) => (
														<button key={meeting.id} onClick={() => handleJoinMeeting(meeting.meet_url)} className="w-full px-4 py-2 text-left text-gray-900 hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer">
															<Video className="w-5 h-5 me-2 text-blue-600" />
															<div className="teacher">
																<h4 className="text-gray text-md">Ustoz: {meeting?.teacher?.full_name}</h4>
																<p className="text-gray-400 text-sm">Ustoz Tel: {meeting?.teacher?.phone_number}</p>
															</div>
														</button>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							)}
							<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleSave(courseId)} className={`p-2 rounded-xl transition-colors flex items-center gap-2 ${currentStatus ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} disabled={saveLoading}>
								{saveLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : currentStatus ? <CheckCircle className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
							</motion.button>
							<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
								<Share2 className="w-5 h-5" />
							</motion.button>
						</div>
					</div>
				</div>
			</motion.header>
			<div className="max-w-7xl mx-auto py-6">
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-2 space-y-6">
						<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
							<div className="relative">
								<Image src={course.image_url} alt={course.title} width={800} height={400} className="w-full h-64 object-cover" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
							</div>
							<div className="p-6">
								<h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
								<p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
								<div className="grid grid-cols-2 gap-4 mt-6 py-6 border-t border-gray-200">
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-900">{modules.length}</div>
										<div className="text-sm text-gray-600">Modullar</div>
									</div>
									{/* <div className="text-center">
										<div className="text-2xl font-bold text-gray-900">{contents.length}</div>
										<div className="text-sm text-gray-600">Kontent</div>
									</div> */}
								</div>
							</div>
						</div>
						<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
							{contents.map((content) => {
								const isOpen = openId === content.id
								return (
									<motion.div key={content.id} className="p-4 md:p-6 overflow-hidden">
										<motion.button layout onClick={() => handleToggle(content.id)} className="w-full flex justify-between items-center text-left transition">
											<h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
											<ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
										</motion.button>
										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div key="content-body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="pb-6 pt-6 mt-4 border-t border-gray-200">
													<p className="text-gray-600 mb-4 leading-relaxed">{content.description}</p>
													{content.content_url && <iframe className="w-full h-150" src={content.content_url} title={content.title}></iframe>}
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								)
							})}
						</div>
					</motion.div>
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
						<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
									<BookOpen className="w-5 h-5 text-blue-600" />
									Kurs modullari
								</h2>
								<p className="text-gray-600 text-sm mt-1">
									{count.course_module_count} modul
								</p>
							</div>
							<div className="divide-y divide-gray-200">
								{modules.map((module, index) => (
									<motion.div key={module.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-white">
										<button onClick={() => router.push(`${courseId}/module/${module.id}/lessons`)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-300 group">
											<div className="flex items-center gap-4 flex-1 text-left">
												<div className="w-10 h-10 bg-myZoneOnline rounded-xl flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{module.title}</h3>
													<p className="text-gray-600 text-sm mt-1 line-clamp-2">{module.description}</p>
												</div>
											</div>
										</button>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
