import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { LessonMaterialPayload } from '@/types'
import { FileUploader } from '@/components/UI/UploadImageFirebase'

interface CreateLessonMaterialModalProps {
	closeModal: () => void
	handleCreate: (data: LessonMaterialPayload) => Promise<void>
}

interface EditLessonMaterialModalProps {
	id: string
	closeModal: () => void
	fetchMaterial: (materialId: string) => Promise<LessonMaterialPayload | undefined>
	handleUpdate: (id: string, data: LessonMaterialPayload) => Promise<void>
}

interface DeleteLessonMaterialModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const CreateLessonMaterialModal = ({ closeModal, handleCreate }: CreateLessonMaterialModalProps) => {
	const [formData, setFormData] = useState<LessonMaterialPayload>({ title: '', description: '', material_url: '' })

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="materialCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div>
				<label className="block text-sm font-medium mb-2">Sarlavha *</label>
				<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Tavsif</label>
				<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border rounded-xl" />
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Material URL</label>
				<FileUploader folder="materials" type="any" fileUrl={formData.material_url} onChange={(url) => setFormData({ ...formData, material_url: url })} />
			</div>
		</form>
	)
}

export const EditLessonMaterialModal = ({ id, closeModal, fetchMaterial, handleUpdate }: EditLessonMaterialModalProps) => {
	const [formData, setFormData] = useState<LessonMaterialPayload | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadMaterialData = async () => {
			setIsFetchingData(true)
			const res = await fetchMaterial(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadMaterialData()
	}, [fetchMaterial, id])

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
			id="materialEdit"
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
				<label className="block text-sm font-medium text-gray-700 mb-2">Material fayl</label>
				<FileUploader folder="materials" type="any" fileUrl={formData.material_url} onChange={(url) => setFormData({ ...formData, material_url: url })} />
			</div>
		</form>
	)
}

export const DeleteLessonMaterialModal = ({ id, closeModal, handleDelete }: DeleteLessonMaterialModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			id="materialDelete"
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Materialni O‘chirish</h3>
			<p className="text-gray-600 mb-2">Siz ushbu materialni o‘chirishga ishonchingiz komilmi?</p>
		</form>
	)
}