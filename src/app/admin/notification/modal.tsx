'use client'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useStudents } from '@/hooks/useStudents'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationPayload, NotificationTYPE } from '@/types'

interface Props {
	closeModal: () => void
	handleCreate: (data: { notification_id: string; user_id: string }) => Promise<void>
}

interface NotificationCreate {
	closeModal: () => void
	handleCreate: (data: NotificationPayload, userId?: string) => Promise<void>
}

interface NotificationEdit {
	id: string
	closeModal: () => void
	handleUpdate(id: string, data: NotificationPayload): Promise<void>
	fetchNotification: (id: string) => Promise<NotificationPayload | undefined>
}

interface NotificationDelete {
	id: string
	closeModal: () => void
	handleDelete: (id: string) => Promise<void>
}

export const CreateNotificationUserModal = ({ closeModal, handleCreate }: Props) => {
	const { students } = useStudents()
	const { notifications } = useNotifications()
	const [selectedUser, setSelectedUser] = useState<string>('')
	const [notificationId, setNotificationId] = useState<string>('')

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate({ user_id: selectedUser, notification_id: notificationId })
				closeModal()
			}}
			id="notificationUserCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Foydalanuvchi tanlash *</label>
				<select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition">
					<option value="">Foydalanuvchini tanlang</option>
					{students.map((u) => (
						<option key={u.id} value={u.id}>
							{u.full_name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Bildirishnoma tanlash *</label>
				<select value={notificationId} onChange={(e) => setNotificationId(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition">
					<option value="">Bildirishnomani tanlang</option>
					{notifications.map((n) => (
						<option key={n.id} value={n.id}>
							{n.title}
						</option>
					))}
				</select>
			</div>
		</form>
	)
}

export const CreateNotificationModal = ({ closeModal, handleCreate }: NotificationCreate) => {
	const { students } = useStudents()
	const [formData, setFormData] = useState<NotificationPayload>({
		title: '',
		message: '',
		type: 'SUCCSESS',
		is_global: true,
	})
	const [selectedUser, setSelectedUser] = useState<string>('')

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleCreate(formData, formData.is_global ? undefined : selectedUser)
				closeModal()
			}}
			id="notificationCreate"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Sarlavhani kiriting" />
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Turi</label>
					<select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as NotificationTYPE })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Turini tanlang
						</option>
						{['SUCCSESS', 'ERROR', 'WARNING', 'INFO'].map((type, idx) => (
							<option key={idx} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center gap-2">
					<input type="checkbox" checked={formData.is_global} onChange={(e) => setFormData({ ...formData, is_global: e.target.checked })} className="w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
					<label className="text-sm font-medium text-gray-700">Global bildirishnoma (barcha foydalanuvchilarga yuborish)</label>
				</div>

				{!formData.is_global && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Foydalanuvchi tanlash *</label>
						<select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required={!formData.is_global} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition">
							<option value="">Foydalanuvchini tanlang</option>
							{students.map((u) => (
								<option key={u.id} value={u.id}>
									{u.full_name}
								</option>
							))}
						</select>
					</div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Xabar *</label>
					<textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Xabarni kiriting"></textarea>
				</div>
			</div>
		</form>
	)
}

export const EditNotificationModal = ({ id, closeModal, fetchNotification, handleUpdate }: NotificationEdit) => {
	const [formData, setFormData] = useState<NotificationPayload | null>(null)
	const [isFetchingData, setIsFetchingData] = useState(true)

	useEffect(() => {
		const loadNotificationData = async () => {
			setIsFetchingData(true)
			const res = await fetchNotification(id)
			if (res) setFormData(res)
			setIsFetchingData(false)
		}
		loadNotificationData()
	}, [fetchNotification, id])

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
			id="notificationEdit"
			className="p-4 space-y-4 md:p-6 md:space-y-6"
		>
			<div className="grid grid-cols-1 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha *</label>
					<input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Sarlavhani kiriting" />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Turi</label>
					<select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as NotificationTYPE })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						<option value="" disabled>
							Turini tanlang
						</option>
						{['SUCCSESS', 'ERROR', 'WARNING', 'INFO'].map((type, idx) => (
							<option key={idx} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-center gap-2">
					<input type="checkbox" checked={formData.is_global} onChange={(e) => setFormData({ ...formData, is_global: e.target.checked })} className="w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
					<label className="text-sm font-medium text-gray-700">Global bildirishnoma</label>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Xabar *</label>
					<textarea rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" placeholder="Xabarni kiriting"></textarea>
				</div>
			</div>
		</form>
	)
}

export const DeleteNotificationModal = ({ id, closeModal, handleDelete }: NotificationDelete) => {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleDelete(id)
				closeModal()
			}}
			className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
			id="notificationDelete"
		>
			<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trash2 className="w-10 h-10 text-red-600" />
			</div>

			<h3 className="text-2xl font-bold text-gray-900 mb-3">Bildirishnomani o‘chirish</h3>
			<p className="text-gray-600 mb-2">Ushbu bildirishnomani o‘chirmoqchimisiz?</p>
			<p className="text-sm text-gray-500 mb-6">Bu amalni qaytarib bo‘lmaydi. Barcha bildirishnoma ma’lumotlari tizimdan doimiy ravishda o‘chiriladi.</p>
		</form>
	)
}
