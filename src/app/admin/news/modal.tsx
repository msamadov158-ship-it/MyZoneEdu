'use client'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { NewsEdit } from '@/types'
import { FileUploader } from '@/components/UI/UploadImageFirebase'

interface NewsCreateModalProps {
    closeModal: () => void
    handleCreate(data: NewsEdit): Promise<void>
}

interface NewsEditModalProps {
    id: string
    closeModal: () => void
    fetchNews: (id: string) => Promise<NewsEdit | undefined>
    handleUpdate(id: string, data: NewsEdit): Promise<void>
}

interface NewsDeleteModalProps {
    id: string
    closeModal: () => void
    handleDelete: (id: string) => Promise<void>
}

export const CreateNewsModal = ({ closeModal, handleCreate }: NewsCreateModalProps) => {
    const [formData, setFormData] = useState<NewsEdit>({
        title: '',
        description: '',
        content: '',
        image_url: '',
        file_url: '',
    })

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await handleCreate(formData)
                closeModal()
            }}
            id="newsCreate"
            className="p-4 space-y-4 md:p-6 md:space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sarlavha */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sarlavha *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Yangilik sarlavhasini kiriting"
                    />
                </div>

                {/* Description (qisqa tavsif) */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qisqa tavsif *
                    </label>
                    <textarea
                        rows={3}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Yangilikning qisqa mazmuni (meta description uchun)"
                    />
                </div>

                {/* Asosiy kontent (to'liq matn) */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To'liq matn / Kontent *
                    </label>
                    <textarea
                        rows={10}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-mono text-sm"
                        placeholder="Yangilikning to'liq matni, HTML yoki oddiy matn shaklida..."
                    />
                </div>

                {/* Rasm (image_url) */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asosiy rasm
                    </label>
                    <FileUploader
                        folder="news"
                        type="image"
                        fileUrl={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                    />
                </div>

                {/* Fayl (file_url) – pdf, doc yoki boshqa fayl */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qo‘shimcha fayl (pdf, docx, ...)
                    </label>
                    <FileUploader
                        folder="news/files"
                        type="any"           // yoki "file" deb o‘zgartirishingiz mumkin
                        fileUrl={formData.file_url}
                        onChange={(url) => setFormData({ ...formData, file_url: url })}
                    />
                </div>

            </div>
        </form>
    )
}

export const EditNewsModal = ({ id, closeModal, fetchNews, handleUpdate }: NewsEditModalProps) => {
    const [formData, setFormData] = useState<NewsEdit | null>(null)
    const [isFetchingData, setIsFetchingData] = useState(true)

    useEffect(() => {
        const loadNewsData = async () => {
            setIsFetchingData(true)
            const res = await fetchNews(id)
            if (res) setFormData(res)
            setIsFetchingData(false)
        }
        loadNewsData()
    }, [fetchNews, id])

    if (isFetchingData || !formData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
                <div className="text-white">
                    {isFetchingData ? 'Yuklanmoqda...' : "Ma'lumot topilmadi."}
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await handleUpdate(id, formData)
                closeModal()
            }}
            id="newsEdit"
            className="p-4 space-y-4 md:p-6 md:space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sarlavha */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sarlavha *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Yangilik sarlavhasini kiriting"
                    />
                </div>

                {/* Description */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qisqa tavsif *
                    </label>
                    <textarea
                        rows={3}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Yangilikning qisqa mazmuni"
                    />
                </div>

                {/* Content */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To'liq matn / Kontent *
                    </label>
                    <textarea
                        rows={10}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-mono text-sm"
                        placeholder="Yangilikning to'liq matni..."
                    />
                </div>

                {/* Rasm */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asosiy rasm
                    </label>
                    <FileUploader
                        folder="news"
                        type="image"
                        fileUrl={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                    />
                </div>

                {/* Fayl */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qo‘shimcha fayl
                    </label>
                    <FileUploader
                        folder="news/files"
                        type="any"
                        fileUrl={formData.file_url}
                        onChange={(url) => setFormData({ ...formData, file_url: url })}
                    />
                </div>

            </div>
        </form>
    )
}

export const DeleteNewsModal = ({ id, closeModal, handleDelete }: NewsDeleteModalProps) => {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await handleDelete(id)
                closeModal()
            }}
            id="newsDelete"
            className="text-center p-4 space-y-4 md:p-6 md:space-y-6"
        >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-10 h-10 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Yangilikni o‘chirish</h3>
            <p className="text-gray-600 mb-2">Siz ushbu yangilikni o‘chirishga ishonchingiz komilmi?</p>
            <p className="text-sm text-gray-500 mb-6">
                Ushbu amalni qaytarib bo‘lmaydi. Yangilik va unga bog‘liq barcha ma’lumotlar doimiy ravishda o‘chiriladi.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Muhim eslatma
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                    <li>• Yangilik butunlay o‘chiriladi</li>
                    <li>• Rasm va fayllar serverdan yo‘q qilinishi mumkin</li>
                    <li>• Bu amal qaytarib bo‘lmaydi</li>
                </ul>
            </div>
        </form>
    )
}
