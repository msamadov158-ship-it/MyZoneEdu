import { toast } from 'react-toastify'
export const handleApiError = (err: unknown, message?: string): void => {
    console.log("err", err)
    console.log("err", message)

    if (err instanceof Error) {
        toast.error(message || err.message)
    } else {
        toast.error(message || 'Xatolik yuz berdi!')
    }
}
