import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { CourseContent, CourseContentEdit } from '@/types'
import { FileUploader } from '@/components/UI/UploadImageFirebase'

interface CreateCourseContentModalProps {
	closeModal: () => void
	handleCreate: (data: CourseContentEdit) => Promise<void>
}

export const CreateCourseContentModal = ({ closeModal, handleCreate }: CreateCourseContentModalProps) => {
	const [formData, setFormData] = useState<CourseContentEdit>({ title: '', description: '', content_url: '' })

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="createContent"
			className="4-6 space-y-4 md:p-6 md:space-y-6"
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
				<FileUploader folder="contents" type="pdf" fileUrl={formData.content_url as string} onChange={(url) => setFormData({ ...formData, content_url: url })} />
			</div>
		</form>
	)
}

interface EditCourseContentModalProps {
	id: string
	closeModal: () => void
	fetchContent: (id: string) => Promise<CourseContent | undefined>
	handleUpdate: (id: string, data: CourseContentEdit) => Promise<void>
}

export const EditCourseContentModal = ({ id, closeModal, fetchContent, handleUpdate }: EditCourseContentModalProps) => {
	const [formData, setFormData] = useState<CourseContentEdit | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadContentData = async () => {
			setIsFetchingData(true)
			const res = await fetchContent(id)
			if (res) {
				setFormData(res)
			}
			setIsFetchingData(false)
		}
		loadContentData()
	}, [fetchContent, id])

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
				handleUpdate(id, formData)
				closeModal()
			}}
			id="contentEdit"
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
				<FileUploader folder="contents" type="pdf" fileUrl={formData.content_url as string} onChange={(url) => setFormData({ ...formData, content_url: url })} />
			</div>
		</form>
	)
}

interface DeleteCourseContentModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const DeleteCourseContentModal = ({ id, closeModal, handleDelete }: DeleteCourseContentModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			id="contentDelete"
			className=" text-center p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Kontentni o‘chirish</h3>
			<p className="text-gray-600 mb-2">Haqiqatan ham ushbu kontentni o‘chirmoqchimisiz?</p>
			<p className="text-sm text-gray-500 mb-6">Bu amalni ortga qaytarib bo‘lmaydi. Ushbu kontentga tegishli barcha ma’lumotlar tizimdan butunlay o‘chiriladi.</p>
		</form>
	)
}
