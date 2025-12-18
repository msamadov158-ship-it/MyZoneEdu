'use client'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { CourseEdit } from '@/types'
import { useTypes } from '@/hooks/useTypes'
import { FileUploader } from '@/components/UI/UploadImageFirebase'

interface CourseCreateModalProps {
	closeModal: () => void
	handleCreate(data: CourseEdit): Promise<void>
}

interface CourseEditModalProps {
	id: string
	closeModal: () => void
	fetchCourse: (id: string) => Promise<CourseEdit | undefined>
	handleUpdate(id: string, data: CourseEdit): Promise<void>
}

interface CourseDeleteModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const CreateCourseModal = ({ closeModal, handleCreate }: CourseCreateModalProps) => {
	const [formData, setFormData] = useState<CourseEdit>({ description: '', image_url: '', type_id: '', level: '', title: '', is_active: true })
	const { types } = useTypes()

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="courseCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Kurs nomini kiriting" />
				</div>

				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Daraja *</label>
					<input type="text" required value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Darajani kiriting" />
				</div>

				<div className="col-span-2">
					<FileUploader folder="courses" type="image" fileUrl={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} />
				</div>

				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Tur</label>
					<select required value={formData.type_id} onChange={(e) => setFormData({ ...formData, type_id: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Tur tanlang
						</option>
						{types.map((type) => (
							<option key={type.id} value={type.id}>
								{type.title}
							</option>
						))}
					</select>
				</div>

				<div className="col-span-2">
					<label className="block col-span-1 text-sm font-medium text-gray-700 mb-2">Tavsif *</label>
					<textarea rows={10} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Kurs tavsifini kiriting" />
				</div>
			</div>
		</form>
	)
}

export const EditCourseModal = ({ id, closeModal, fetchCourse, handleUpdate }: CourseEditModalProps) => {
	const { types } = useTypes()
	const [formData, setFormData] = useState<CourseEdit | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadCourseData = async () => {
			setIsFetchingData(true)
			const res = await fetchCourse(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadCourseData()
	}, [fetchCourse, id])

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
			id="courseEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Kurs nomini kiriting" />
				</div>

				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Daraja *</label>
					<input type="text" required value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Darajani kiriting" />
				</div>

				<div className="col-span-2">
					<FileUploader folder="courses" type="image" fileUrl={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} />
				</div>

				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">Tur</label>
					<select value={formData.type_id} onChange={(e) => setFormData({ ...formData, type_id: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Tur tanlang
						</option>
						{types.map((type) => (
							<option key={type.id} value={type.id}>
								{type.title}
							</option>
						))}
					</select>
				</div>

				<div className="col-span-2">
					<label className="block col-span-1 text-sm font-medium text-gray-700 mb-2">Tavsif *</label>
					<textarea rows={10} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Kurs tavsifini kiriting" />
				</div>
			</div>
		</form>
	)
}

export const DeleteCourseModal = ({ id, closeModal, handleDelete }: CourseDeleteModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			id="courseDelete"
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Kursni O‘chirish</h3>
			<p className="text-gray-600 mb-2">Siz ushbu kursni o‘chirishga ishonchingiz komilmi?</p>
			<p className="text-sm text-gray-500 mb-6">Ushbu amalni qaytarib bo‘lmaydi. Barcha talaba ma’lumotlari tizimdan doimiy ravishda o‘chiriladi.</p>

			<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
				<h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
					<span className="w-2 h-2 bg-red-600 rounded-full"></span>
					Muhim Eslatma
				</h4>
				<ul className="text-sm text-red-700 space-y-1">
					<li>• Kurs o‘chiriladi</li>
					<li>• Kursga yozilishlar o‘chiriladi</li>
					<li>• Progress ma’lumotlari yo‘qoladi</li>
				</ul>
			</div>
		</form>
	)
}