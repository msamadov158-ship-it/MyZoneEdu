import API from '@/lib/axios'
import { News, NewsEdit } from '@/types'

export const newsService = {
    async getAll(): Promise<News[]> {
        const res = await API.get('/api/news/')
        return res.data.result ?? []   // backenddan qaytgan formatga qarab o‘zgartirishingiz mumkin
    },

    async getById(id: string): Promise<NewsEdit> {
        const res = await API.get(`/api/news/${id}`)
        return res.data.result
    },

    async create(data: NewsEdit): Promise<void> {
        await API.post('/api/news/', data)
    },

    async update(id: string, data: NewsEdit): Promise<void> {
        await API.patch(`/api/news/${id}`, data)
    },

    async delete(id: string): Promise<void> {
        await API.delete(`/api/news/${id}`)
    },
}
