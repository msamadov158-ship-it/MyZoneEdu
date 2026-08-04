import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Lesson, LessonPayload } from '@/types'
import { handleApiError } from '@/lib/helpers/handleApiError'
import { courseLessonService } from '@/services/courseLessonService'

export const useLessons = (moduleId?: string) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)

    const fetchLessons = useCallback(async () => {
        if (!moduleId) return
        setLoading(true)
        try {
            const res = await courseLessonService.getAll(moduleId)
            setLessons(res)
        } catch (err) {
            handleApiError(err, 'Lesson listini olib kelishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [moduleId])

    const fetchLesson = useCallback(async (lessonId: string): Promise<LessonPayload | undefined> => {
        if (!lessonId) return
        setLoading(true)
        try {
            return await courseLessonService.getById(lessonId)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const createLesson = useCallback(async (lesson: LessonPayload) => {
        if (!moduleId || !lesson) return
        setLoading(true)
        try {
            await courseLessonService.create(moduleId, lesson)
            toast.success('Lesson yaratildi')
            await fetchLessons()
        } catch (err) {
            handleApiError(err, 'Lesson yaratishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [moduleId, fetchLessons])

    const updateLesson = useCallback( async (lessonId: string, lesson: LessonPayload) => {
        if (!lessonId || !lesson) return
        setLoading(true)
        try {
            await courseLessonService.update(lessonId, lesson)
            toast.success("Lesson o'zgartirildi")
            await fetchLessons()
        } catch (err) {
            handleApiError(err, "Lesson o'zgartirildi xatolik!")
        } finally {
            setLoading(false)
        }
    }, [fetchLessons])

    const deleteLesson = useCallback(async (lessonId: string) => {
        if (!lessonId) return

        setLoading(true)
        try {
            await courseLessonService.delete(lessonId)
            toast.success('Module o‘chirildi')
            await fetchLessons()
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchLessons])

    useEffect(() => {
        fetchLessons()
    }, [fetchLessons])

    return {isLoading, lessons, fetchLessons, fetchLesson, createLesson, updateLesson, deleteLesson}
}
