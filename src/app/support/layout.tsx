'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/layout/LayoutWrapper'
import { StudentMenu, SupportMenu } from '@/constants/menu'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [role, setRole] = useState<string | null>(null)

	useEffect(() => {
		queueMicrotask(() => {
			const user = getUserFromStorage()
			if (user?.role) {
				setRole(user.role)
			}
		})
	}, [])

	const RoleMenu = role === 'SUPPORT' ? SupportMenu : StudentMenu

	return (
		<div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
			<Layout menuItems={RoleMenu} />
			<main className="w-full fixed top-20 lg:top-21 left-0 lg:left-80 lg:w-[calc(100%-320px)] h-[calc(100dvh-80px)] lg:h-[calc(100dvh-84px)] overflow-y-auto p-2 sm:p-4 md:p-6">{children}</main>
		</div>
	)
}
