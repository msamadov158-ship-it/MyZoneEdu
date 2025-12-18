'use client'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import { useModal } from '@/components/UI/Modal'
import { useQuestions } from '@/hooks/useQuestions'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateQuestionModal, DeleteQuestionModal, EditQuestionModal } from './modal'

export default function Questions() {
	const { lessonId } = useParams<{ lessonId: string }>()
	const { openModal, closeModal } = useModal()
	const { loading, questions, fetchQuestion, handleCreate, handleUpdate, handleDelete } = useQuestions(lessonId)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredQuestions = useMemo(() => {
		if (!searchTerm.trim()) return questions
		return questions.filter((q) => q.question_text.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [questions, searchTerm])

	const handleOpenCreate = () => {
		openModal({
			type: 'CREATE',
			formId: 'questionCreate',
			title: 'Savol Qo‘shish',
			btnTitle: 'Yaratish',
			content: <CreateQuestionModal lessonId={lessonId} closeModal={closeModal} handleCreate={handleCreate} />,
		})
	}

	const handleOpenEdit = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'questionEdit',
			title: 'Savolni Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditQuestionModal id={id} closeModal={closeModal} fetchQuestion={fetchQuestion} handleUpdate={handleUpdate} />,
		})
	}

	const handleOpenDelete = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'questionDelete',
			title: 'Savolni O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteQuestionModal id={id} closeModal={closeModal} handleDelete={handleDelete} />,
		})
	}

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Savollar yuklanmoqda...</p>
					</div>
				</motion.div>
			) : questions.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Savollar topilmadi</h3>
					<p className="text-gray-600 mb-4">Birinchi savolingizni qo‘shish orqali boshlang</p>
					<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
						Savol Qo‘shish
					</button>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
					<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
						<h3 className="text-lg font-semibold text-gray-900">So‘nggi savollar</h3>
						<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition">
							Savol Qo‘shish
						</button>
					</div>

					<div className="px-6 py-4 border-b border-gray-200 flex gap-4">
						<input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 ring-blue-500 transition-all duration-300 w-full outline-0" />
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Savol matni</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Variant A</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Variant B</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Variant C</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Variant D</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">To‘g‘ri</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredQuestions.map((question, index) => (
									<motion.tr key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap text-gray-600 truncate max-w-xs">{question.question_text}</td>
										<td className="px-6 py-4 text-gray-600 truncate max-w-xs">{question.option_a}</td>
										<td className="px-6 py-4 text-gray-600 truncate max-w-xs">{question.option_b}</td>
										<td className="px-6 py-4 text-gray-600 truncate max-w-xs">{question.option_c}</td>
										<td className="px-6 py-4 text-gray-600 truncate max-w-xs">{question.option_d}</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{question.correct_option}</span>
										</td>
										<td className="px-6 py-4 flex gap-4 whitespace-nowrap">
											<button onClick={() => handleOpenEdit(question.id.toString())} className="text-indigo-600 hover:text-indigo-800">
												Tahrirlash
											</button>
											<button onClick={() => handleOpenDelete(question.id.toString())} className="text-red-600 hover:text-red-800">
												O‘chirish
											</button>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
