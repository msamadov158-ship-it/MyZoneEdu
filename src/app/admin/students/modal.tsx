'use client'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { StudentEdit, Role } from '@/types'
import { useTypes } from '@/hooks/useTypes'

interface StudentCreateModalProps {
	closeModal: () => void
	handleCreate(data: StudentEdit): Promise<void>
}

export const CreateStudentModal = ({ closeModal, handleCreate }: StudentCreateModalProps) => {
	const [formData, setFormData] = useState<StudentEdit>({ full_name: '', username: '', phone_number: '', role: 'STUDENT', active_term: 0, password: '', type_id: '', is_active: true })
	const { types } = useTypes()

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData)
				closeModal()
			}}
			id="studentCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
					<input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter full name" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
					<input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter username" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Active Term *</label>
					<input type="number" required value={formData.active_term} onChange={(e) => setFormData({ ...formData, active_term: Number(e.target.value) })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter active term" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
					<input type="tel" required value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter phone number" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
					<input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter password" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
					<select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="STUDENT">Student</option>
						<option value="ADMIN">Admin</option>
						<option value="TEACHER">Teacher</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
					<select value={formData.type_id} onChange={(e) => setFormData({ ...formData, type_id: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Select a type
						</option>
						{types.map((type) => (
							<option key={type.id} value={type.id}>
								{type.title}
							</option>
						))}
					</select>
				</div>
			</div>
		</form>
	)
}

interface StudentEditModalProps {
	id: string
	closeModal: () => void
	fetchStudent: (id: string) => Promise<StudentEdit | undefined>
	handleUpdate(id: string, data: StudentEdit): Promise<void>
}

export const EditStudentModal = ({ id, closeModal, fetchStudent, handleUpdate }: StudentEditModalProps) => {
	const { types } = useTypes()

	const [formData, setFormData] = useState<StudentEdit | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadStudentData = async () => {
			setIsFetchingData(true)
			const res = await fetchStudent(id)
			if (res) {
				setFormData(res)
			}
			setIsFetchingData(false)
		}
		loadStudentData()
	}, [fetchStudent, id])

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
			id="studentEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
					<input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter full name" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
					<input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter username" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Active Term *</label>
					<input type="number" required value={formData.active_term} onChange={(e) => setFormData({ ...formData, active_term: Number(e.target.value) })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter active term" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
					<input type="tel" required value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter phone number" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
					<input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Enter password" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
					<select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="STUDENT">Student</option>
						<option value="ADMIN">Admin</option>
						<option value="TEACHER">Teacher</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
					<select value={formData.type_id} onChange={(e) => setFormData({ ...formData, type_id: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Select a type
						</option>
						{types.map((type) => (
							<option key={type.id} value={type.id}>
								{type.title}
							</option>
						))}
					</select>
				</div>
			</div>
		</form>
	)
}

interface StudentDeleteModalProps {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const DeleteStudentModal = ({ id, closeModal, handleDelete }: StudentDeleteModalProps) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
			id="studentDelete"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Student</h3>
			<p className="text-gray-600 mb-2">Are you sure you want to delete this student account?</p>
			<p className="text-sm text-gray-500 mb-6">This action cannot be undone. All student data will be permanently removed from the system.</p>

			<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
				<h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
					<span className="w-2 h-2 bg-red-600 rounded-full"></span>
					Important Notice
				</h4>
				<ul className="text-sm text-red-700 space-y-1">
					<li>• Student profile will be deleted</li>
					<li>• Course enrollments will be removed</li>
					<li>• Progress data will be lost</li>
				</ul>
			</div>
		</form>
	)
}
