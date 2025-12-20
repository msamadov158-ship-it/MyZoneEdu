export type MaterialType = 'image' | 'video' | 'pdf' | 'file'

export const getMaterialType = (url: string): MaterialType => {
    const extension = url.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'image'
    }
    if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) {
        return 'video'
    }
    if (extension === 'pdf') {
        return 'pdf'
    }
    return 'file'
}
