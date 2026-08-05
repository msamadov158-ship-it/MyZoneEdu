import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { News, NewsEdit } from '@/types'           // News va NewsEdit typelarini yarating
import { newsService } from '@/services/newsService' // yangi service
import { handleApiError } from '@/lib/helpers/handleApiError'

export const useNews = () => {
    const [loading, setLoading] = useState(false)
    const [newsList, setNewsList] = useState<News[]>([])

    const fetchNews = useCallback(async () => {
        setLoading(true)
        try {
            const res = await newsService.getAll()
            setNewsList(res)
            console.log(res);
            
        } catch (err) {
            handleApiError(err, 'Yangiliklarni yuklashda xatolik')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchNewsItem = useCallback(async (id: string) => {
        setLoading(true)
        try {
            return await newsService.getById(id)
        } catch (err) {
            handleApiError(err, 'Yangilik ma‘lumotini yuklab bo‘lmadi')
            return undefined
        } finally {
            setLoading(false)
        }
    }, [])

    const createNews = useCallback(async (data: NewsEdit) => {
        setLoading(true)
        try {
            await newsService.create(data)
            fetchNews()
            toast.success('Yangilik yaratildi')
        } catch (err) {
            handleApiError(err, 'Yangilik yaratishda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchNews])

    const updateNews = useCallback(async (id: string, data: NewsEdit) => {
        setLoading(true)
        try {
            await newsService.update(id, data)
            fetchNews()
            toast.success('Yangilik yangilandi')
        } catch (err) {
            handleApiError(err, 'Yangilashda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchNews])

    const deleteNews = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await newsService.delete(id)
            toast.success('Yangilik o‘chirildi')
            fetchNews()
        } catch (err) {
            handleApiError(err, 'O‘chirishda xatolik')
        } finally {
            setLoading(false)
        }
    }, [fetchNews])

    useEffect(() => {
        fetchNews()
    }, [fetchNews])

    return {
        loading,
        newsList,
        fetchNewsItem,
        createNews,
        updateNews,
        deleteNews,
    }
}
