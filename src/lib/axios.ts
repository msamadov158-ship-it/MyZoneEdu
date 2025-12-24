import axios from 'axios'
import { HOST } from './constants'
import { clearToken } from './helpers/userStore'

const containsFiles = (data: unknown): boolean => {
    if (typeof data !== 'object' || data === null) return false

    for (const key in data as Record<string, unknown>) {
        const value = (data as Record<string, unknown>)[key]
        if (value instanceof File || value instanceof Blob) {
            return true
        }
    }
    return false
}

const API = axios.create({ baseURL: HOST })

API.interceptors.request.use(
    (config) => {
        let token: string = ''

        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MY_ZONE_ONLINE_TOKEN) {
            const stored = localStorage.getItem(process.env.NEXT_PUBLIC_MY_ZONE_ONLINE_TOKEN)
            token = stored ? JSON.parse(stored)?.access_token || '' : ''
        }

        if (token) config.headers.Authorization = `Bearer ${token}`

        if (config.data && containsFiles(config.data)) config.headers['Content-Type'] = 'multipart/form-data'
        else config.headers['Content-Type'] = 'application/json'

        return config
    },
    (error) => Promise.reject(error)
)

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            if (currentPath.startsWith('/')) {
                return Promise.reject(error)
            }
            clearToken()

            if (typeof window !== 'undefined') {
                window.location.href = '/'
            }

            return Promise.reject(error)
        }
        return Promise.reject(error)
    }
)

export default API
