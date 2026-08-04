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

        // const token = typeof window !== 'undefined' ? localStorage.getItem('MY_ZONE_ONLINE_TOKEN') : null

        if(typeof window !== 'undefined'){
            const rawStored = localStorage.getItem('MY_ZONE_ONLINE_TOKEN') || (process.env.NEXT_PUBLIC_MY_ZONE_ONLINE_TOKEN ? localStorage.getItem(process.env.NEXT_PUBLIC_MY_ZONE_ONLINE_TOKEN) : null)

            if(rawStored){
                try{
                        const parsed = JSON.parse(rawStored)
                        token  =token = parsed?.access_token || parsed?.token || rawStored
                } catch{
                    token = rawStored
                }
            }
        }

        if (token) config.headers.Authorization = `Bearer ${token}`

        if (config.data && containsFiles(config.data)) {config.headers['Content-Type'] = 'multipart/form-data'}
        else {config.headers['Content-Type'] = 'application/json'}

        return config
    },
    (error) => Promise.reject(error)
)

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("errorrr", error)
        if (error.response && error.response.status === 401) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            if (currentPath.startsWith('/')) {
                return Promise.reject(error)
            }

            if (typeof window !== 'undefined') {
                window.location.href = '/'
            }

            clearToken()

            return Promise.reject(error)
        }
        return Promise.reject(error)
    }
)

export default API
