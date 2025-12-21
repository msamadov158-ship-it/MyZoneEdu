'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLessons } from '@/hooks/useLessons'
import { useModal } from '@/components/UI/Modal'
import { Clock, Edit, FileText, Play, Plus, Trash2, Video } from 'lucide-react'
import { CreateLessonModal, DeleteLessonModal, EditLessonModal } from './modal'
import MaterilList from '../Material'
import { useEffect } from 'react'

interface LessonProps {
	moduleId: string
	onCount: (count: number) => void
	handleOpenEdit: (id: string) => void
	handleOpenDelete: (id: string) => void
}

export default function Lesson({ moduleId, onCount, handleOpenEdit, handleOpenDelete }: LessonProps) {
	const { openModal, closeModal } = useModal()
	const { lessons, fetchLesson, createLesson, updateLesson, deleteLesson } = useLessons(moduleId)

	const handleOpenCreateLesson = () => {
		openModal({
			type: 'CREATE',
			formId: 'lessonCreate',
			title: 'Dars Yaratish',
			btnTitle: 'Yaratish',
			content: <CreateLessonModal closeModal={closeModal} handleCreate={createLesson} />,
		})
	}

	const handleOpenEditLesson = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'lessonEdit',
			title: 'Darsni Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditLessonModal id={id} closeModal={closeModal} fetchLesson={fetchLesson} handleUpdate={updateLesson} />,
		})
	}

	const handleOpenDeleteLesson = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'lessonDelete',
			title: 'Darsni O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteLessonModal id={id} closeModal={closeModal} handleDelete={deleteLesson} />,
		})
	}

	useEffect(() => {
		onCount(lessons.length)
	}, [moduleId, lessons.length])

	return (
		<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-100 bg-gray-50">
			<div className="p-4 md:p-6">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
					<h4 className="font-semibold text-gray-900 flex items-center gap-2">
						<Play className="w-5 h-5 text-blue-600" />
						Ushbu moduldagi darslar
					</h4>

					<motion.button onClick={handleOpenCreateLesson} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="self-end px-4 py-2 bg-myZoneOnline text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Dars qo‘shish
					</motion.button>
				</div>

				<div className="space-y-3">
					{[...lessons]
						.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
						.map((lesson, idx) => {
							return (
								<motion.div key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 group">
									<div className="flex flex-col lg:flex-row gap-6">
										<div className="flex-shrink-0 w-full lg:w-48">
											<div className="relative aspect-video rounded-xl overflow-hidden bg-myZoneOnline">
												{lesson.cover_url ? (
													<Image src={lesson.cover_url} alt={lesson.title} width={100} height={100} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<Video className="w-8 h-8 text-white opacity-80" />
													</div>
												)}

												<div className="absolute inset-0 flex items-center justify-center">
													<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl" onClick={() => window.open(lesson.video_url, '_blank')}>
														<Play className="w-5 h-5 text-blue-600 ml-0.5" />
													</motion.button>
												</div>

												<div className="absolute bottom-3 left-3">
													<span className="inline-flex items-center px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
														<Clock className="w-3 h-3 mr-1" />
														{lesson.duration}
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between mt-3 text-xs text-gray-500">
												<div className="flex items-center gap-1">
													<Video className="w-4 h-4" />
													<span>Video</span>
												</div>
												<div className="flex items-center gap-1">
													<FileText className="w-4 h-4" />
													<span>Kontent</span>
												</div>
											</div>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex flex-col h-full">
												<div className="flex items-start justify-between gap-4 mb-3">
													<div className="flex-1 min-w-0">
														<h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{lesson.title}</h5>

														{lesson.description && <p className="text-gray-600 mt-2 line-clamp-2">{lesson.description}</p>}
													</div>

													<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
														<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEditLesson(lesson.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="Darsni tahrirlash">
															<Edit className="w-4 h-4" />
														</motion.button>
														<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenDeleteLesson(lesson.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Darsni o‘chirish">
															<Trash2 className="w-4 h-4" />
														</motion.button>
													</div>
												</div>

												<div className="mb-4">
													<div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
														<FileText className="w-4 h-4" />
														<span>Dars kontenti</span>
													</div>
													<div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
														<p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{lesson.content}</p>
													</div>
												</div>

												{<MaterilList lessonId={lesson.id} />}

												<div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
													<div className="flex items-center gap-4 text-sm text-gray-500">
														<span className="flex items-center gap-1">
															<Clock className="w-4 h-4" />
															{lesson.duration}
														</span>
													</div>

													<div className="flex items-center gap-2">
														<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.open(lesson.video_url, '_blank')} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
															<Play className="w-3 h-3" />
															Tomosha qilish
														</motion.button>
														<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:border-gray-400 transition-colors">
															Ko‘rib chiqish
														</motion.button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							)
						})}
				</div>

				<div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-200 gap-3">
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEdit(moduleId)} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
						<Edit className="w-4 h-4" />
						Modulni tahrirlash
					</motion.button>

					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenDelete(moduleId)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
						<Trash2 className="w-4 h-4" />
						Modulni o‘chirish
					</motion.button>
				</div>
			</div>
		</motion.div>
	)
}
