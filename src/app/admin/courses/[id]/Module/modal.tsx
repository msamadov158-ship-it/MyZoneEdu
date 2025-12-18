import { Module, ModuleEdit } from '@/types'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ModuleCreateModalProps {
	closeModal: () => void
	handleCreate(data: ModuleEdit): Promise<void>
}

interface ModuleEditModalProps {
	id: string
	closeModal: () => void
	fetchModule: (id: string) => Promise<Module | null>
	handleUpdate(id: string, data: ModuleEdit): Promise<void>
}

interface ModuleDeleteModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const CreateModuleModal = ({ closeModal, handleCreate }: ModuleCreateModalProps) => {
	const [formData, setFormData] = useState<ModuleEdit>({ title: '', description: '', order: 0 })

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="moduleCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Tartib *</label>
					<input type="number" required value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Tavsif *</label>
					<textarea rows={10} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
			</div>
		</form>
	)
}

export const EditModuleModal = ({ id, closeModal, fetchModule, handleUpdate }: ModuleEditModalProps) => {
	const [formData, setFormData] = useState<ModuleEdit | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadModuleData = async () => {
			setIsFetchingData(true)
			const res = await fetchModule(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadModuleData()
	}, [fetchModule, id])

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
			id="moduleEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Tartib *</label>
					<input type="number" required value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Tavsif *</label>
					<textarea rows={10} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
				</div>
			</div>
		</form>
	)
}

export const DeleteModuleModal = ({ id, closeModal, handleDelete }: ModuleDeleteModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			id="moduleDelete"
			className="p-4 space-y-4 md:p-6 md:space-y-6 text-center"
		>
			<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-8 h-8 text-red-600" />
			</div>
			<h3 className="text-xl font-bold text-gray-900 mb-2">Modulni O‘chirish</h3>
			<p className="text-gray-600 mb-4">Siz ushbu modulni o‘chirishga ishonchingiz komilmi?</p>
			<p className="text-sm text-gray-500 mb-6">Ushbu amalni qaytarib bo‘lmaydi. Moduldagi barcha darslar va kontentlar doimiy ravishda o‘chiriladi.</p>
		</form>
	)
}
