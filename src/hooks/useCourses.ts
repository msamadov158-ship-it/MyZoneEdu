import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Course, CourseEdit } from '@/types'
import { courseService } from '@/services/courseService'
import { handleApiError } from '@/lib/helpers/handleApiError'

export const useCourses = () => {
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])

    const fetchCourses = useCallback(async () => {
        setLoading(true)
        try {
            const res = await courseService.getAll()
            setCourses(res)
            console.log(res);
            
        } catch (err) {
            handleApiError(err, 'Courselarni yuklashda xatolik')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchCourse = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await courseService.getById(id)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const createCourse = useCallback(async (course: CourseEdit) => {
        setLoading(true)
        try {
            await courseService.create(course)
            fetchCourses()
            toast.success('Course yaratildi')
        } catch (err) {
            handleApiError(err, 'Course yaratishda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchCourses])

    const updateCourse = useCallback(async (id: string, course: CourseEdit) => {
        if (!id || !course) 
        setLoading(true)
        try {
            await courseService.update(id, course)
            fetchCourses()
            toast.success('Course yangilandi')
        } catch (err) {
            handleApiError(err, 'Yangilashda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchCourses])

    const deleteCourse = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await courseService.delete(id)
            toast.success('Course o‘chirildi')
            fetchCourses()
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchCourses])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return {
        courses,
        loading,
        fetchCourse,
        fetchCourses,
        createCourse,
        updateCourse,
        deleteCourse,
    }
}
