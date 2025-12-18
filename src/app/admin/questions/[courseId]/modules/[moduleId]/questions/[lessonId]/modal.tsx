'use client'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { QuestionEdit } from '@/types'

interface QuestionCreateModalProps {
	lessonId: string
	closeModal: () => void
	handleCreate(data: QuestionEdit): Promise<void>
}

export const CreateQuestionModal = ({ lessonId, closeModal, handleCreate }: QuestionCreateModalProps) => {
	const [formData, setFormData] = useState<QuestionEdit>({
		question_text: '',
		option_a: '',
		option_b: '',
		option_c: '',
		option_d: '',
		correct_option: 'A',
		lesson_id: Number(lessonId),
	})

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="questionCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Savol matni *</label>
					<textarea required value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Savol matnini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant A *</label>
					<input type="text" required value={formData.option_a} onChange={(e) => setFormData({ ...formData, option_a: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="A variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant B *</label>
					<input type="text" required value={formData.option_b} onChange={(e) => setFormData({ ...formData, option_b: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="B variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant C *</label>
					<input type="text" required value={formData.option_c} onChange={(e) => setFormData({ ...formData, option_c: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="C variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant D *</label>
					<input type="text" required value={formData.option_d} onChange={(e) => setFormData({ ...formData, option_d: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="D variantini kiriting" />
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">To‘g‘ri variant *</label>
					<select required value={formData.correct_option} onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="D">D</option>
					</select>
				</div>
			</div>
		</form>
	)
}

interface QuestionEditModalProps {
	id: string
	closeModal: () => void
	fetchQuestion: (id: string) => Promise<QuestionEdit | undefined>
	handleUpdate(id: string, data: QuestionEdit): Promise<void>
}

export const EditQuestionModal = ({ id, closeModal, fetchQuestion, handleUpdate }: QuestionEditModalProps) => {
	const [formData, setFormData] = useState<QuestionEdit | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadQuestionData = async () => {
			setIsFetchingData(true)
			const res = await fetchQuestion(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadQuestionData()
	}, [fetchQuestion, id])

	if (isFetchingData || !formData) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
				<div className="text-white">{isFetchingData ? 'Yuklanmoqda...' : "Ma'lumot topilmadi."}</div>
			</div>
		)
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleUpdate(id, formData)
				closeModal()
			}}
			id="questionEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Savol matni *</label>
					<textarea required value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Savol matnini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant A *</label>
					<input type="text" required value={formData.option_a} onChange={(e) => setFormData({ ...formData, option_a: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="A variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant B *</label>
					<input type="text" required value={formData.option_b} onChange={(e) => setFormData({ ...formData, option_b: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="B variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant C *</label>
					<input type="text" required value={formData.option_c} onChange={(e) => setFormData({ ...formData, option_c: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="C variantini kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Variant D *</label>
					<input type="text" required value={formData.option_d} onChange={(e) => setFormData({ ...formData, option_d: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="D variantini kiriting" />
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">To‘g‘ri variant *</label>
					<select required value={formData.correct_option} onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="D">D</option>
					</select>
				</div>
			</div>
		</form>
	)
}

interface QuestionDeleteModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const DeleteQuestionModal = ({ id, closeModal, handleDelete }: QuestionDeleteModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
			id="questionDelete"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Savolni o‘chirish</h3>
			<p className="text-gray-600 mb-2">Ushbu savolni o‘chirmoqchimisiz?</p>
			<p className="text-sm text-gray-500 mb-6">Ushbu amalni bekor qilib bo‘lmaydi. Savol va barcha variantlar tizimdan doimiy o‘chiriladi.</p>

			<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
				<h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
					<span className="w-2 h-2 bg-red-600 rounded-full"></span>
					Muhim eslatma
				</h4>
				<ul className="text-sm text-red-700 space-y-1">
					<li>• Savol o‘chiriladi</li>
					<li>• Barcha javob variantlari ham o‘chiriladi</li>
					<li>• Test ma’lumotlariga ta’sir bo‘lishi mumkin</li>
				</ul>
			</div>
		</form>
	)
}
