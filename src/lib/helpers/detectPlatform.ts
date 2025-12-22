// src/lib/helpers/detectPlatform.ts

export type PlatformType =
    | 'ios'
    | 'android'
    | 'desktop'
    | 'tablet'
    | 'unknown'

export function detectPlatform(): PlatformType {
    if (typeof window === 'undefined') return 'unknown'

    const ua = navigator.userAgent || navigator.vendor

    // iOS (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(ua)) {
        return 'ios'
    }

    // Android
    if (/Android/.test(ua)) {
        return 'android'
    }

    // Tablets (non-iOS)
    if (
        /Tablet|PlayBook|Silk/i.test(ua) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth >= 768)
    ) {
        return 'tablet'
    }

    // Desktop
    if (window.innerWidth >= 1024) {
        return 'desktop'
    }

    return 'unknown'
}
