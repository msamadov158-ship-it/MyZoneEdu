import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Edit, FolderOpen, Trash2 } from 'lucide-react'
import { useModal } from '@/components/UI/Modal'
import { getMaterialType } from '@/utils/fileType'
import { useLessonMaterials } from '@/hooks/useLessonMaterials'
import { CreateLessonMaterialModal, DeleteLessonMaterialModal, EditLessonMaterialModal } from './modal'

export default function MaterilList({ lessonId }: { lessonId: string }) {
	const { openModal, closeModal } = useModal()
	const { materials, fetchMaterial, createMaterial, updateMaterial, deleteMaterial } = useLessonMaterials(lessonId)
	const [openId, setOpenId] = useState<string | null>(null)

	const toggleOpen = (id: string) => {
		setOpenId(openId === id ? null : id)
	}

	const handleOpenCreateMaterial = () => {
		openModal({
			type: 'CREATE',
			formId: 'materialCreate',
			title: 'Material Yaratish',
			btnTitle: 'Yaratish',
			content: <CreateLessonMaterialModal closeModal={closeModal} handleCreate={createMaterial} />,
		})
	}

	const handleOpenEditMaterial = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'materialEdit',
			title: 'Materialni Tahrirlash',
			btnTitle: 'Tahrirlash',
			content: <EditLessonMaterialModal id={id} closeModal={closeModal} fetchMaterial={fetchMaterial} handleUpdate={updateMaterial} />,
		})
	}

	const handleOpenDeleteMaterial = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'materialDelete',
			title: 'Materialni O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteLessonMaterialModal id={id} closeModal={closeModal} handleDelete={deleteMaterial} />,
		})
	}

	return (
		<div className="mt-6 border-t border-gray-100 py-6">
			<div className="flex items-center justify-between mb-4">
				<h6 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<FolderOpen className="w-5 h-5 text-blue-600" />
					Dars Materiallari
				</h6>

				<motion.button onClick={handleOpenCreateMaterial} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="self-end px-4 py-2 bg-myZoneOnline text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
					Material Qo‘shish
				</motion.button>
			</div>

			<div className="space-y-4">
				{materials.map((mat) => {
					const type = getMaterialType(mat.material_url)
					const isOpen = openId === mat.id

					return (
						<div key={mat.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
							<button onClick={() => toggleOpen(mat.id)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors">
								<div>
									<h4 className="font-semibold text-gray-900">{mat.title}</h4>
									{mat.description && <p className="text-gray-600 text-sm mt-1">{mat.description}</p>}
								</div>
								<div className="flex items-center gap-2">
									<Edit className="w-4 h-4 text-blue-600" onClick={() => handleOpenEditMaterial(mat.id)} />
									<Trash2 className="w-4 h-4 text-red-600" onClick={() => handleOpenDeleteMaterial(mat.id)} />
									{isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
								</div>
							</button>

							<AnimatePresence initial={false}>
								{isOpen && (
									<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4">
										<iframe src={mat.material_url} className="w-full h-100"></iframe>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)
				})}
			</div>
		</div>
	)
}
