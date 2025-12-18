import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { LessonPayload } from '@/types'
import { FileUploader } from '@/components/UI/UploadImageFirebase'

interface CreateLessonModalProps {
	closeModal: () => void
	handleCreate: (data: LessonPayload) => Promise<void>
}

export const CreateLessonModal = ({ closeModal, handleCreate }: CreateLessonModalProps) => {
	const [formData, setFormData] = useState<LessonPayload>({ title: '', description: '', content: '', duration: '', order: 0, cover_url: '', video_url: '' })

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="lessonCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
				<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
				<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Kontent</label>
				<textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Davomiyligi (masalan: 10:25)</label>
				<input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Tartib raqami</label>
				<input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Muqova rasmi</label>
				<FileUploader folder="lessons" type="image" fileUrl={formData.cover_url} onChange={(url) => setFormData({ ...formData, cover_url: url })} />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Video havolasi</label>
				<FileUploader folder="lessons" type="video" fileUrl={formData.video_url} onChange={(url) => setFormData({ ...formData, video_url: url })} />
			</div>
		</form>
	)
}

interface EditLessonModalProps {
	id: string
	closeModal: () => void
	fetchLesson: (lessonId: string) => Promise<LessonPayload | undefined>
	handleUpdate: (id: string, data: LessonPayload) => Promise<void>
}

export const EditLessonModal = ({ id, closeModal, fetchLesson, handleUpdate }: EditLessonModalProps) => {
	const [formData, setFormData] = useState<LessonPayload | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadLessonData = async () => {
			setIsFetchingData(true)
			const res = await fetchLesson(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadLessonData()
	}, [fetchLesson, id])

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
			id="lessonEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
				<input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
				<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Kontent</label>
				<textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Davomiyligi</label>
					<input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Tartib raqami</label>
					<input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-3 border rounded-xl" />
				</div>
			</div>

			<div>
				<FileUploader folder="lessons" type="image" fileUrl={formData.cover_url} onChange={(url) => setFormData({ ...formData, cover_url: url })} />
			</div>

			<div>
				<FileUploader folder="lessons" type="video" fileUrl={formData.video_url} onChange={(url) => setFormData({ ...formData, video_url: url })} />
			</div>
		</form>
	)
}

interface DeleteLessonModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const DeleteLessonModal = ({ id, closeModal, handleDelete }: DeleteLessonModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			id="lessonDelete"
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Darsni o‘chirish</h3>
			<p className="text-gray-600 mb-2">Haqiqatan ham ushbu darsni o‘chirmoqchimisiz?</p>
			<p className="text-sm text-gray-500 mb-6">Bu amalni ortga qaytarib bo‘lmaydi. Darsga tegishli barcha ma’lumotlar tizimdan butunlay o‘chiriladi.</p>
		</form>
	)
}
