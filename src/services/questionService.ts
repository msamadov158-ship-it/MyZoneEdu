import API from '@/lib/axios'
import { Question, QuestionEdit } from '@/types/index'

export const questionService = {
    async getAll(lessonId: string | number): Promise<Question[]> {
        const res = await API.get(`/api/lesson_test/lesson/${lessonId}`)
        return res.data.result
    },

    async getById(id: string): Promise<QuestionEdit> {
        const res = await API.get(`/api/lesson_test/${id}`)
        return res.data.result
    },

    async create(lessonId: string | number, data: QuestionEdit): Promise<void> {
        await API.post(`/api/lesson_test/lesson/${lessonId}`, data)
    },

    async update(id: string, data: QuestionEdit): Promise<void> {
        await API.patch(`/api/lesson_test/${id}`, data)
    },

    async delete(id: string | number): Promise<void> {
        await API.delete(`/api/lesson_test/${id}`)
    },
}