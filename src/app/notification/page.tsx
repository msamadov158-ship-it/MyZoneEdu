'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Loader2, CheckCircle } from 'lucide-react'
import { Notification } from '@/types'
import { useNotifications } from '@/hooks/useNotifications'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export default function NotificationList() {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [notReadCount, setNotReadCount] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [notificationsUser, setNotificationsUsers] = useState<
		{
			created_at: string
			id: string
			is_read: boolean
			notification_id: string
			read_at: string
			user_id: string
		}[]
	>([])

	const { loading, getNotificationsByUser, readNotificationUser } = useNotifications()
	const userId: string = getUserFromStorage()?.user_id || ''

	useEffect(() => {
		if (!userId) return

		const fetchData = async () => {
			try {
				const data = await getNotificationsByUser(userId)
				setNotifications(data?.notifications || [])
				setNotReadCount(data?.not_read_count || 0)
				setTotalCount(data?.notification_count || 0)
				setNotificationsUsers(data?.notification_users || [])
			} catch (err) {
				console.error('Bildirishnomalarni olishda xatolik:', err)
			}
		}

		fetchData()
	}, [getNotificationsByUser, userId])

	const handleRead = async (notificationId: string) => {
		try {
			await readNotificationUser(userId, {
				notification_id: notificationId,
			})

			// frontend holatini yangilash
			setNotificationsUsers((prev) => prev.map((n) => (n.notification_id === notificationId ? { ...n, is_read: true } : n)))
			setNotReadCount((prev) => (prev > 0 ? prev - 1 : 0))
		} catch (err) {
			console.error('O‘qilgan deb belgilashda xatolik:', err)
		}
	}

	const isNotificationRead = (notificationId: string) => {
		return notificationsUser.some((n) => n.notification_id === notificationId && n.is_read === true)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-60 text-gray-500">
				<Loader2 className="w-6 h-6 animate-spin mr-2" />
				Yuklanmoqda...
			</div>
		)
	}

	if (!notifications?.length) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-500">
				<Bell className="w-10 h-10 mb-3 text-gray-400" />
				<p>Hozircha hech qanday bildirishnoma yo‘q.</p>
			</div>
		)
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
					<Bell className="w-6 h-6 text-blue-600" />
					Bildirishnomalar
				</h2>
				<div className="text-sm text-gray-600">
					<span className="font-medium">Jami:</span> {totalCount} |<span className="ml-2 font-medium text-blue-600">O‘qilmagan:</span> {notReadCount}
				</div>
			</div>

			<div className="space-y-4">
				{notifications.map((noti, index) => {
					const isRead = isNotificationRead(noti.id)

					return (
						<motion.div key={noti.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`rounded-xl border p-4 shadow-sm transition-all duration-300 ${isRead ? 'bg-white border-gray-200 opacity-80' : 'bg-blue-50 border-blue-300'}`}>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-semibold text-gray-900">{noti.title}</h3>
									<p className="text-gray-700 mt-1 text-sm">{noti.message}</p>
									<span className="text-xs text-gray-500 mt-2 block">{new Date(noti.created_at).toLocaleString()}</span>
								</div>

								{isRead ? (
									<div className="flex items-center gap-1 text-green-600 text-sm font-medium">
										<CheckCircle className="w-4 h-4" />
										O‘qilgan
									</div>
								) : (
									<button onClick={() => handleRead(noti.id)} className="text-blue-600 text-sm border border-blue-600 rounded-lg px-3 py-1 hover:bg-blue-600 hover:text-white transition">
										O‘qidim
									</button>
								)}
							</div>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}
