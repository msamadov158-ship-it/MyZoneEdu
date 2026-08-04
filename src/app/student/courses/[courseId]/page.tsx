'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, CheckCircle, Share2, Bookmark, ArrowLeft, Loader2, Video, CheckCircle2, PlayCircle, Lock } from 'lucide-react'
import { CourseEdit } from '@/types'
import { useCourse } from '@/hooks/useCourse'
import { useCourses } from '@/hooks/useCourses'
import { useCourseSave } from '@/hooks/useCourseSave'
import { useCourseContent } from '@/hooks/useCourseContent'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import API from '@/lib/axios'
import { toast } from 'react-toastify'

import { useLessons } from '@/hooks/useLessons'


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

	const [modulId, setModulID] = useState('')
	const { lessons, isLoading } = useLessons(modulId)

	const toggleModul = (id:string) => {
		setModulID((prev) => (prev === id ? '' : id))
	}

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

	// const activeMeetings = meetingInfo.filter((meeting) => meeting.status === 'ACTIVE')

	// const handleJoinMeeting = (meet_url: string) => {
	// 	if (meet_url) {
	// 		window.open(meet_url, '_blank')
	// 		setIsDropdownOpen(false)
	// 	}
	// }



	if (loading || !course) {
		return (
			<div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg font-medium">Kurs mazmuni yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	const currentStatus = isSaved(courseId)

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">

			{/* top Navbar */}
			<motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
								<ArrowLeft className="w-6 h-6 text-red-700" />
							</motion.button>
							<div className=' flex items-center'>
								<h1 className="text-xl font-bold text-red-700 line-clamp-1">My Zone Online</h1>
								<p className="text-gray-400 ml-10  ">/   {course.title}</p>
							</div>
						</div>
						{/* zoom */}
						{/* <div className="flex items-center gap-3">
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
						</div> */}
					</div>
				</div>
			</motion.header>

			{/* left and right side big */}
			<div className="max-w-7xl mx-auto  ">
				<div className="grid grid-cols-1 xl:grid-cols-3 ">

							{/* left */}
					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-2 space-y-6">
						<div className="bg-white  shadow-lg border border-gray-200 overflow-hidden">
							<div className="relative">
								<Image src={course.image_url} alt={course.title} width={800} height={400} className="w-full h-64 object-cover" />
								<div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
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
								{/* right */}
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
						<div className="bg-white   border border-gray-200 overflow-hidden">
							<div className=" p-3 pb-0  border-b border-gray-200 ">
								<h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
									<BookOpen className="w-5 h-5 text-blue-600" />
										Kurs modullari
								</h2>

								<div className='w-full flex py-2 justify-between items-center text-gray-400 text-xs'>
									<p>35% BAJARILGAN</p>
									<p>4 / 12 Darslar</p>
								</div>

								<div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
									<div
										className="bg-red-700 h-2 rounded-full"
										// style={{ width: `${course.progress}%` }}
										style={{width:'35%'}}
									/>
								</div>
							</div>

							<div className="divide-y divide-gray-200">
								{modules.map((module, index) => {
									const isOpen = modulId === module.id;

									return (
									<motion.div
										key={module.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: index * 0.1 }}
										className="bg-white"
									>
										{/* Module header */}
										<button
										onClick={() => toggleModul(module.id)}
										className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-300 group ${isOpen && 'bg-red-100'}`}
										>
										<div className="flex-1 min-w-0 text-left">
											<h3 className="font-semibold text-gray-900 group-hover:text-[#d00000] transition-colors line-clamp-1">
											{module.title}
											</h3>
											{module.description && (
											<p className="text-gray-600 text-sm mt-1 line-clamp-2">{module.description}</p>
											)}
										</div>
										<motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
											<ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
										</motion.div>
										</button>

										{/* LEssonlar */}
										<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
											key="content"
											layout
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.25, ease: 'easeInOut' }}
											className="overflow-hidden "
											>
											<div className="pb-2">
												{isLoading ? (
														<>
															{[1, 2, 3].map((i) => (
															<div key={i} className="flex items-center gap-3 px-6 py-3 pl-8">
																<div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse shrink-0" />
																<div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
															</div>
															))}
														</>
												) : (
													lessons?.map((lesson, lessonIndex) => {
													// First lesson is always unlocked; otherwise locked if the previous lesson isn't completed
													const isLocked =
														lessonIndex > 0 && !lessons[lessonIndex - 1].is_active;

													return (
														<button
																	key={lesson.id}
																	onClick={() =>
																	!isLocked &&
																	router.push(`${courseId}/module/${module.id}/lessons/${lesson.id}`)
																}
																disabled={isLocked}
																className={`w-full flex items-center justify-between px-6 py-3 pl-8 text-left transition-colors ${
																	isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
																}`}
																>
																<div className="flex items-center gap-3">
																	{isLocked ? (
																	<Lock className="w-5 h-5 text-gray-300" strokeWidth={2} />
																	) : lesson.is_active ? (
																	<CheckCircle2 className="w-5 h-5 shrink-0 fill-[#d00000] text-white" strokeWidth={2} />
																	) : (
																	<div className="w-5 h-5 rounded-full border-2 border-gray-300" />
																	)}
																	<span
																	className={`text-sm ${
																		isLocked
																		? 'text-gray-400'
																		: lesson.is_active
																		? 'text-gray-800'
																		: 'text-[#d00000] font-medium'
																	}`}
																	>
																	{lesson.title}
																	</span>
																</div>
																	<span className="text-xs text-gray-400">{lesson.duration}</span>
														</button>
												);
												})
												)}
											</div>
											</motion.div>
										)}
										</AnimatePresence>
									</motion.div>
									);
								})}
								</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}

// () => router.push(`${courseId}/module/${module.id}/lessons`)

// {modules.map((module, index) => (
// 									<motion.div key={module.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-white">
// 										<button onClick={() => router.push(`${courseId}/module/${module.id}/lessons`)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-300 group">
// 											<div className="flex items-center gap-4 flex-1 text-left">
// 												<div className="w-10 h-10 bg-myZoneOnline rounded-xl flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
// 												<div className="flex-1 min-w-0">
// 													<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{module.title}</h3>
// 													<p className="text-gray-600 text-sm mt-1 line-clamp-2">{module.description}</p>
// 												</div>
// 											</div>
// 										</button>
// 									</motion.div>
// 								))}
