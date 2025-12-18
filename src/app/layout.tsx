'use client'
import { useEffect } from 'react'
import type { Metadata } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import '@/styles/globals.css'
import ToastProvider from '@/providers/ToastProvider'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const user = getUserFromStorage()

		if (!user) {
			router.replace('/')
			return
		}

		if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
			router.replace('/student')
			return
		}
	}, [pathname, router])

	return (
		<html lang="en" className="dark">
			<body>
				<ToastProvider>{children}</ToastProvider>
			</body>
		</html>
	)
}
