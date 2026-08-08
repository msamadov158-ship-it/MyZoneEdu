'use client'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Type, TypeEdit } from '@/types'
import { typeService } from '@/services/typeService'
import { handleApiError } from '@/lib/helpers/handleApiError'

export const useTypes = () => {
    const [types, setTypes] = useState<Type[]>([])
    const [loading, setLoading] = useState(false)

    const fetchTypes = useCallback(async () => {
        setLoading(true)
        try {
            const data = await typeService.getAll()
            setTypes(data)
            // console.log(data);
            
        } catch (err) {
            handleApiError(err, 'Typeslar yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchType = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await typeService.getById(id)
        } catch (err) {
            handleApiError(err, 'Ma’lumotni yuklab bo‘lmadi!')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate =  useCallback( async (type: TypeEdit) => {
        setLoading(true)
        try {
            await typeService.create(type)
            toast.success('Tupe muvaffaqiyatli yaratildi!')
            await fetchTypes()
        } catch (err) {
            handleApiError(err, 'Ro‘yxatdan o‘tishda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchTypes])

    const handleUpdate = useCallback( async (id: string, type: TypeEdit) => {
        if (!type) return
        setLoading(true)
        try {
            await typeService.update(id, type)
            toast.success('Type ma’lumotlari yangilandi!')
            await fetchTypes()
        } catch (err) {
            handleApiError(err, 'Yangilashda xatolik!')
        } finally {
            setLoading(false)
        }
    }, [fetchTypes])

    const handleDelete = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await typeService.delete(id)
            toast.success('Type muvaffaqiyatli o‘chirildi!')
            await fetchTypes()
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }, [fetchTypes])

    useEffect(() => {
        fetchTypes()
    }, [fetchTypes])

    return {
        loading,
        types,
        setLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        fetchType,
        fetchTypes,
    }
}
