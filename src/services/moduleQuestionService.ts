import API from '@/lib/axios'
import { Question, QuestionEdit } from '@/types/index'

export const moduleQuestionService = {
    async getAll(moduleId: string | number): Promise<Question[]> {
        const res = await API.get(`/api/module_test/module/${moduleId}`)
        return res.data.result
    },

    async getById(id: string): Promise<QuestionEdit> {
        const res = await API.get(`/api/module_test/${id}`)
        return res.data.result
    },

    async create(moduleId: string | number, data: QuestionEdit): Promise<void> {
        await API.post(`/api/module_test/module/${moduleId}`, data)
    },

    async update(id: string, data: QuestionEdit): Promise<void> {
        await API.patch(`/api/module_test/${id}`, data)
    },

    async delete(id: string | number): Promise<void> {
        await API.delete(`/api/module_test/${id}`)
    },
}