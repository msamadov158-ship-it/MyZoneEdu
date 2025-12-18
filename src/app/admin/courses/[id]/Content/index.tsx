'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, Edit, Trash2 } from 'lucide-react'
import { useModal } from '@/components/UI/Modal'
import { fadeUp, staggeredList } from '@/lib/motion'
import { useCourseContent } from '@/hooks/useCourseContent'
import { CreateCourseContentModal, EditCourseContentModal, DeleteCourseContentModal } from './modal'

export default function CourseContent() {
	const { id } = useParams<{ id: string }>()
	const { openModal, closeModal } = useModal()
	const { loading, contents, fetchContent, createContent, updateContent, deleteContent } = useCourseContent(id)

	const [openId, setOpenId] = useState<string | null>(null)

	const handleAccordion = (id: string) => {
		setOpenId((prev) => (prev === id ? null : id))
	}

	const handleOpenCreateContent = () => {
		openModal({
			type: 'CREATE',
			formId: 'createContent',
			title: 'Kontentni Yaratish',
			btnTitle: 'Yaratish',
			content: <CreateCourseContentModal closeModal={closeModal} handleCreate={createContent} />,
		})
	}

	const handleOpenEditContent = (contentId: string) => {
		openModal({
			type: 'EDIT',
			formId: 'contentEdit',
			title: 'Kontentni Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditCourseContentModal id={contentId} closeModal={closeModal} fetchContent={fetchContent} handleUpdate={updateContent} />,
		})
	}

	const handleOpenDeleteContent = (contentId: string) => {
		openModal({
			type: 'DELETE',
			formId: 'contentDelete',
			title: 'Kontentni O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteCourseContentModal id={contentId} closeModal={closeModal} handleDelete={deleteContent} />,
		})
	}

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Kurs tarkibi yuklanmoqda…</p>
					</div>
				</motion.div>
			) : contents.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Kontent topilmadi</h3>
					<p className="text-gray-600 mb-4">Boshlash uchun birinchi modulni qo‘shing</p>
					<button onClick={handleOpenCreateContent} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
						Kontent yaratish
					</button>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="space-y-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Kurs modullari</h2>
							<p className="text-gray-600 mt-1">Batafsil ko‘rish uchun modulni oching</p>
						</div>
						<button onClick={handleOpenCreateContent} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition">
							Kontent qo‘shish
						</button>
					</div>

					{contents.map((content) => {
						const isOpen = openId === content.id
						return (
							<motion.div key={content.id} layout className="bg-white rounded-xl shadow-md overflow-hidden" transition={{ layout: { duration: 0.3 } }}>
								<motion.button layout onClick={() => handleAccordion(content.id)} className="w-full flex justify-between items-center px-6 py-4 text-left">
									<h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
									<ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
								</motion.button>

								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div key="content-body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="px-6 py-4 border-t border-gray-300">
											<p className="text-gray-600 mb-4">{content.description}</p>
											<iframe className="w-full h-150 mb-4" src={content.content_url}></iframe>

											<div className="flex gap-3">
												<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEditContent(content.id)} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-2">
													<Edit className="w-4 h-4" /> Tahrirlash
												</motion.button>
												<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenDeleteContent(content.id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-2">
													<Trash2 className="w-4 h-4" /> O‘chirish
												</motion.button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						)
					})}
				</motion.div>
			)}
		</motion.div>
	)
}
