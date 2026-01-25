'use client'
import { Metadata } from 'next'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '@/styles/globals.css'
import ToastProvider from '@/providers/ToastProvider'
import { clearToken, getUserFromStorage } from '@/lib/helpers/userStore'
import { ToastContainer } from 'react-toastify'

const metadata: Metadata = {
	title: "MyZone Online Platform"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const user = getUserFromStorage()

		if (!user) {
			router.replace('/')
			return
		}

		const redirectByRole = (role: string) => {
			switch (role) {
				case 'ADMIN':
					router.replace('/admin')
					break
				case 'TEACHER':
					router.replace('/teacher')
					break
				case 'STUDENT':
					router.replace('/student')
					break
				case 'SUPPORT':
					router.replace('/support')
					break
				default:
					clearToken()
					router.replace('/')
			}
		}

		if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
			redirectByRole(user.role)
			return
		}

		if (pathname.startsWith('/teacher') && user.role !== 'TEACHER') {
			redirectByRole(user.role)
			return
		}

		if (pathname.startsWith('/student') && user.role !== 'STUDENT') {
			redirectByRole(user.role)
			return
		}

		if (pathname.startsWith('/support') && !(user.role === 'SUPPORT' || user.role === 'STUDENT')) {
			redirectByRole(user.role)
			return
		}
	}, [pathname, router])

	return (
		<html lang="en" className="dark" >
			<body>
				<ToastContainer />
				{children}
			</body>
		</html>
	)
}
