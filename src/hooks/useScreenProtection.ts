'use client'

import { useEffect, useState } from 'react'
import devtools from 'devtools-detect'
import { detectPlatform } from '@/lib/helpers/detectPlatform'

export function useScreenProtection(
    videoRef?: React.RefObject<HTMLVideoElement | null>
) {
    const [blocked, setBlocked] = useState(false)
    const platform = detectPlatform()

    useEffect(() => {
        if (platform === 'ios') return
        if (!videoRef?.current) return

        const video = videoRef.current

        const onVisibility = () => {
            if (document.hidden) setBlocked(true)
        }

        const onBlur = () => setBlocked(true)

        const onPause = () => {
            if (!video.ended) setBlocked(true)
        }

        const onResize = () => {
            if (platform === 'desktop') setBlocked(true)
        }

        document.addEventListener('visibilitychange', onVisibility)
        window.addEventListener('blur', onBlur)
        window.addEventListener('resize', onResize)
        video.addEventListener('pause', onPause)

        const interval = setInterval(() => {
            if (platform === 'desktop' && devtools.isOpen) {
                setBlocked(true)
            }
        }, 500)

        return () => {
            document.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('blur', onBlur)
            window.removeEventListener('resize', onResize)
            video.removeEventListener('pause', onPause)
            clearInterval(interval)
        }
    }, [platform, videoRef])

    return blocked
}
