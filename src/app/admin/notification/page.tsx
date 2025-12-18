'use client'
import { Trash2, BookOpen, Edit } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationTYPE } from '@/types'
import { useModal } from '@/components/UI/Modal'
import { fadeUp, staggeredList } from '@/lib/motion'
import { useNotifications } from '@/hooks/useNotifications'
import { CreateNotificationModal, DeleteNotificationModal, EditNotificationModal } from './modal'

export const getPriorityColor = (priority: NotificationTYPE) => {
	switch (priority) {
		case 'ERROR':
			return 'bg-red-100 text-red-800 border-red-200'
		case 'WARNING':
			return 'bg-orange-100 text-orange-800 border-orange-200'
		case 'INFO':
			return 'bg-primary-100 text-primary-800 border-primary-200'
		case 'SUCCSESS':
			return 'bg-green-100 text-green-800 border-green-200'
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200'
	}
}

export default function NotificationsPage() {
	const { openModal, closeModal } = useModal()
	const { loading, notifications, fetchNotification, createNotification, updateNotification, deleteNotification } = useNotifications()

	const handleOpenCreate = () => {
		openModal({
			type: 'CREATE',
			formId: 'notificationCreate',
			title: 'Bildirishnoma Yaratish',
			btnTitle: 'Yaratish',
			content: <CreateNotificationModal closeModal={closeModal} handleCreate={createNotification} />,
		})
	}

	const handleOpenEdit = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'notificationEdit',
			title: 'Bildirishnomani Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditNotificationModal id={id} closeModal={closeModal} fetchNotification={fetchNotification} handleUpdate={updateNotification} />,
		})
	}

	const handleOpenDelete = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'notificationDelete',
			title: 'Bildirishnomani O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteNotificationModal id={id} closeModal={closeModal} handleDelete={deleteNotification} />,
		})
	}

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Bildirishnoma ma'lumotlari yuklanmoqda...</p>
					</div>
				</motion.div>
			) : notifications.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Bildirishnoma topilmadi</h3>
					<p className="text-gray-600 mb-4">Birinchi bildirishnomangizni qo‘shish bilan boshlang</p>
					<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
						Bildirishnoma yaratish
					</button>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Barcha bildirishnomalar</h2>
							<p className="text-gray-600 mt-1">Ta’lim kontentingizni boshqaring</p>
						</div>
						<div className="flex items-center gap-4">
							<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition">
								Yangi bildirishnoma
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						<AnimatePresence>
							{notifications.map((notification, index) => (
								<motion.div key={notification.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-6 hover:bg-gray-50 transition-colors bg-blue-50/50 rounded-xl shadow-sm">
									<div className="flex items-start gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="font-semibold text-lg text-gray-900">{notification.title}</h3>
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notification.type)}`}>{notification.type}</span>
											</div>
											<p className="text-gray-600">{notification.message}</p>
										</div>

										<div className="flex items-center gap-2">
											<button onClick={() => handleOpenEdit(notification.id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Tahrirlash">
												<Edit className="w-4 h-4" />
											</button>
											<button onClick={() => handleOpenDelete(notification.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="O‘chirish">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
