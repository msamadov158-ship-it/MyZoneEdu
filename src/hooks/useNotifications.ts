import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '@/services/notificationService'
import { handleApiError } from '@/lib/helpers/handleApiError'
import { Notification, NotificationPayload } from '@/types'
import { toast } from 'react-toastify'
import { useStudents } from './useStudents'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export const useNotifications = () => {
    const { students } = useStudents()
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const data = await notificationService.getAllNotifications()
            setNotifications(data)
        } catch (err) {
            handleApiError(err, 'Studentlarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchNotification = useCallback(async (notId: string) => {
        setLoading(true)
        try {
            return await notificationService.getNotificationById(notId)
        } catch (err) {
            handleApiError(err, 'Notification yuklashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [])

    const createNotification = useCallback(async (data: NotificationPayload, userId?: string) => {
        if (!data) return
        setLoading(true)

        try {
            const notification = await notificationService.createNotification({
                type: data.type,
                title: data.title,
                message: data.message,
                is_global: data.is_global
            })

            toast.success('Notification yaratildi!')

            if (data.is_global) {
                if (!students?.length) {
                    toast.error('Foydalanuvchilar topilmadi!')
                    return
                }

                toast.loading('Barcha foydalanuvchilarga yuborilmoqda...')

                const requests = students.map((user) =>
                    notificationService.createNotificationUser({
                        notification_id: notification.toString(),
                        user_id: user.id,
                    })
                )

                await Promise.allSettled(requests)

                toast.dismiss()
                toast.success('Global notification barcha foydalanuvchilarga yuborildi!')
            }

            else if (userId) {
                await notificationService.createNotificationUser({
                    notification_id: notification.toString(),
                    user_id: userId,
                })
                toast.info('Notification foydalanuvchiga yuborildi!')
            }

            await fetchNotifications()
        } catch (err) {
            handleApiError(err, 'Notification yaratishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchNotifications, students, setLoading])

    const updateNotification = useCallback(async (id: string, data: NotificationPayload) => {
        if (!id || !data) return
        setLoading(true)
        try {
            await notificationService.updateNotification(id, data)
            await fetchNotifications()
            toast.success('Notification yangilandi')
        } catch (err) {
            handleApiError(err, 'Notificationni yangilashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchNotifications])

    const deleteNotification = useCallback(async (id: string) => {
        if (!id) return
        setLoading(true)
        try {
            await notificationService.deleteNotification(id)
            toast.success('Notification o‘chirildi')
            await fetchNotifications()
        } catch (err) {
            handleApiError(err, 'Notification o\'chirishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchNotifications])

    const readNotificationUser = useCallback(async (userId: string, data: { notification_id: string }) => {
        if (!userId || !data) return
        setLoading(true)
        try {
            await notificationService.readNotificationUser(userId, data)
            await fetchNotifications()
            toast.success('Notification yangilandi')
        } catch (err) {
            handleApiError(err, 'Notificationni yangilashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchNotifications])

    const getNotificationsByUser = useCallback(async (userId: string) => {
        setLoading(true)
        try {
            return await notificationService.getNotificationsByUser(userId)
        } catch (err) {
            handleApiError(err, 'Notification yuklashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [])

    const createNotificationUser = useCallback(async (data: { notification_id: string, user_id: string }) => {
        setLoading(true)
        try {
            await notificationService.createNotificationUser(data)
            await fetchNotifications()
            toast.success('Foydalanuvchiga notification yuborildi')
        } catch (err) {
            handleApiError(err, 'Notification yuborishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchNotifications])

    useEffect(() => {
        if (getUserFromStorage()?.role === "ADMIN") {
            fetchNotifications()
        }
    }, [fetchNotifications, getUserFromStorage])

    return {
        loading,
        notifications,
        fetchNotification,
        fetchNotifications,
        createNotification,
        updateNotification,
        deleteNotification,
        readNotificationUser,
        createNotificationUser,
        getNotificationsByUser,
    }
}
