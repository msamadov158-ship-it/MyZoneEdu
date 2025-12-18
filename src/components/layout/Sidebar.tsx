'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { MenuItem } from '@/types'
import { clearToken } from '@/lib/helpers/userStore'

export default function Sidebar({ isSidebarOpen, menuItems, setIsSidebarOpen }: { isSidebarOpen: boolean; menuItems: MenuItem[]; setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	const pathname = usePathname()
	const router = useRouter()

	const getActiveHref = (path: string, items: MenuItem[]) => {
		let bestMatchHref = ''

		items.forEach((item) => {
			const href = item.href

			if (path === href) {
				if (href.length > bestMatchHref.length) {
					bestMatchHref = href
				}
			} else if (path.startsWith(`${href}/`)) {
				if (href.length > bestMatchHref.length) {
					bestMatchHref = href
				}
			}
		})
		return bestMatchHref
	}

	const activeHref = getActiveHref(pathname, menuItems)
	const isActuallyActive = (href: string) => href === activeHref

	return (
		<>
			{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-5 lg:hidden" />}

			<motion.aside animate={{ x: isSidebarOpen ? 0 : -320 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed top-0 left-0 h-full w-80 z-10 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl lg:top-21 lg:h-[calc(100dvh-84px)] lg:translate-x-0 lg:fixed ${isSidebarOpen ? '' : 'translate-x-[-320px]'}`}>
				<motion.div initial="hidden" animate="visible" className="flex flex-col w-full h-full">
					<div className="p-6 flex items-center justify-between border-b border-gray-200">
						<motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold myZoneOnlineText">
							My Zone Online
						</motion.h1>
					</div>

					<nav className="flex-grow px-4 py-6">
						<ul className="space-y-2">
							{menuItems.map((menu, index) => (
								<motion.li key={menu.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
									<button
										onClick={() => {
											router.push(menu.href)
											setIsSidebarOpen(false)
										}}
										className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-300 ${isActuallyActive(menu.href) ? 'bg-myZoneOnline text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'}`}
									>
										{menu.icon}
										<span className="font-medium">{menu.name}</span>
										{isActuallyActive(menu.href) && <motion.div layoutId="activeMenu" className="ml-auto w-2 h-2 bg-white rounded-full" />}
									</button>
								</motion.li>
							))}
						</ul>
					</nav>

					<div className="p-4 border-t border-gray-200">
						<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={clearToken} className="flex items-center gap-3 w-full p-4 rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group">
							<div className="p-2 rounded-xl bg-red-100 group-hover:bg-red-200 transition-colors">
								<LogOut className="w-4 h-4" />
							</div>
							<span className="font-medium">Logout</span>
						</motion.button>
					</div>
				</motion.div>
			</motion.aside>
		</>
	)
}
