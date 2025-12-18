'use client'
import { useRouter } from 'next/navigation'
import { useState, useCallback, FormEvent, useEffect } from 'react'
import { toast } from 'react-toastify'
import { studentService } from '@/services/userService'
import { setToken } from '@/lib/helpers/userStore'
import { handleApiError } from '@/lib/helpers/handleApiError'
import { Student, StudentEdit } from '@/types/index'

export const useStudents = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [students, setStudents] = useState<Student[]>([])

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        try {
            const data = await studentService.getAll()
            setStudents(data)
        } catch (err) {
            handleApiError(err, 'Studentlarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchStudent = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await studentService.getById(id)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (student: StudentEdit) => {
        setLoading(true)
        try {
            await studentService.create(student)
            fetchStudents()
            toast.success('Student muvaffaqiyatli ro‘yxatdan o‘tkazildi!')
        } catch (err) {
            handleApiError(err, 'Ro‘yxatdan o‘tishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchStudents])

    const handleUpdate = useCallback(async (id: string, student: StudentEdit) => {
        if (!id || !student) return
        setLoading(true)
        try {
            await studentService.update(id, student)
            fetchStudents()
            toast.success('Student ma’lumotlari yangilandi!')
        } catch (err) {
            handleApiError(err, 'Yangilashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchStudents])

    const handleDelete = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await studentService.delete(id)
            fetchStudents()
            toast.success('Student muvaffaqiyatli o‘chirildi!')
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [fetchStudents])

    const loginSubmit = async (e: FormEvent, username: string, password: string) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await studentService.login(username, password)
            setToken(res)
            toast.success('Login muvaffaqiyatli!')
            switch (res.role) {
                case 'ADMIN':
                    return router.push('/admin')
                case 'STUDENT':
                    return router.push('/student')
                case 'TEACHER':
                    return router.push('/teacher')
            }
        } catch (err) {
            handleApiError(err, 'Login yoki parol xato!')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    return {
        loading,
        students,
        setLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        loginSubmit,
        fetchStudent,
        fetchStudents,
    }
}
