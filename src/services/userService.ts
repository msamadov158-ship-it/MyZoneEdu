import API from '@/lib/axios'
import { Role, Student, StudentEdit } from '@/types/index'

export const studentService = {
    async getAll(): Promise<Student[]> {
        const res = await API.get('/api/user/')
        return res.data.result
    },

    async getById(id: string): Promise<StudentEdit> {
        const res = await API.get(`/api/user/${id}`)
        return res.data.result
    },

    async create(data: StudentEdit): Promise<void> {
        await API.post('/api/user/', data)
    },

    async update(id: string, data: StudentEdit): Promise<void> {
        await API.patch(`/api/user/${id}`, data)
    },

    async delete(id: string | number): Promise<void> {
        await API.delete(`/api/user/${id}`)
    },

    async login(username: string, password: string): Promise<{ access_token: string; role: Role; user_id: number }> {
        const res = await API.post('/api/auth/login', { username, password })
        return res.data.result
    },
}
