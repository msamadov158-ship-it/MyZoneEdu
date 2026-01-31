'use client'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Question, QuestionEdit } from '@/types/index'
import { handleApiError } from '@/lib/helpers/handleApiError'
import { moduleQuestionService } from '@/services/moduleQuestionService'

export const useModuleQuestions = (module_id: string) => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])

    const fetchQuestions = useCallback(async () => {
        if (!module_id) return
        setLoading(true)
        try {
            const data = await moduleQuestionService.getAll(module_id)
            setQuestions(data)
        } catch (err) {
            handleApiError(err, 'Savollarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [module_id])

    const fetchQuestion = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await moduleQuestionService.getById(id)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (question: QuestionEdit) => {
        if (!module_id) return
        setLoading(true)
        try {
            await moduleQuestionService.create(module_id, question)
            fetchQuestions()
            toast.success('Savol muvaffaqiyatli yaratildi!')
        } catch (err) {
            handleApiError(err, 'Yaratishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [module_id, fetchQuestions])

    const handleUpdate = useCallback(async (id: string, question: QuestionEdit) => {
        if (!id || !question) return
        setLoading(true)
        try {
            await moduleQuestionService.update(id, question)
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
            await moduleQuestionService.delete(id)
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