import API from '@/lib/axios'
import { Course } from '@/types'

export const courseSaveService = {
    getSaved: async (userId: string): Promise<Course[]> => {
        const res = await API.get(`/api/course_save/${userId}`)
        return res.data.result.course_list
    },
    saveCourse: async (userId: string, courseId: string) => {
        const res = await API.post(`/api/course_save/${userId}`, { course_id: courseId })
        return res.data.result
    },
    deleteCourse: async (userId: string, courseId: string) => {
        await API.delete(`/api/course_save/${userId}`, { data: { course_id: courseId } })
    },
}
