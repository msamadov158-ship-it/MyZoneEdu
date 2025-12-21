'use client'

import { useEffect, useState } from 'react'
import devtools from 'devtools-detect'

export function useScreenProtection() {
    const [blocked, setBlocked] = useState(false)

    useEffect(() => {
        const onVisibility = () => {
            if (document.hidden) setBlocked(true)
        }

        const onBlur = () => setBlocked(true)

        document.addEventListener('visibilitychange', onVisibility)
        window.addEventListener('blur', onBlur)

        const interval = setInterval(() => {
            if (devtools.isOpen) {
                setBlocked(true)
            }
        }, 500)

        return () => {
            document.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('blur', onBlur)
            clearInterval(interval)
        }
    }, [])

    return blocked
}
