'use client'
import { useRouter } from 'next/navigation'
import { useState, useCallback, FormEvent, useEffect } from 'react'
import { toast } from 'react-toastify'
import { questionService } from '@/services/questionService'
import { handleApiError } from '@/lib/helpers/handleApiError'
import { Question, QuestionEdit } from '@/types/index'

export const useQuestions = (lessonId: string) => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])

    const fetchQuestions = useCallback(async () => {
        if (!lessonId) return
        setLoading(true)
        try {
            const data = await questionService.getAll(lessonId)
            setQuestions(data)
        } catch (err) {
            handleApiError(err, 'Savollarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [lessonId])

    const fetchQuestion = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await questionService.getById(id)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (question: QuestionEdit) => {
        if (!lessonId) return
        setLoading(true)
        try {
            await questionService.create(lessonId, question)
            fetchQuestions()
            toast.success('Savol muvaffaqiyatli yaratildi!')
        } catch (err) {
            handleApiError(err, 'Yaratishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [lessonId, fetchQuestions])

    const handleUpdate = useCallback(async (id: string, question: QuestionEdit) => {
        if (!id || !question) return
        setLoading(true)
        try {
            await questionService.update(id, question)
            fetchQuestions()
            toast.success('Savol ma’lumotlari yangilandi!')
        } catch (err) {
            handleApiError(err, 'Yangilashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchQuestions])

    const handleDelete = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await questionService.delete(id)
            fetchQuestions()
            toast.success('Savol muvaffaqiyatli o‘chirildi!')
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [fetchQuestions])

    useEffect(() => {
        fetchQuestions()
    }, [fetchQuestions])

    return {
        loading,
        questions,
        setLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        fetchQuestion,
        fetchQuestions,
    }
}