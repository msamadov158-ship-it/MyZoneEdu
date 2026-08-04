'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogOut, CircleQuestionMarkIcon, Bell, } from 'lucide-react'
import { motion } from 'framer-motion'
import { MenuItem } from '@/types'
import { clearToken } from '@/lib/helpers/userStore'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { useNotifications } from '@/hooks/useNotifications'
import { StoredAuth } from '@/types'

export default function Sidebar({ isSidebarOpen, menuItems, setIsSidebarOpen }: { isSidebarOpen: boolean; menuItems: MenuItem[]; setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	const pathname = usePathname()
	const router = useRouter()

	// use info
	const [user, setUser] = useState<StoredAuth | null>(null)
	const [notificationCount, setNotificationCount] = useState<number>(0)
	const { getNotificationsByUser } = useNotifications()

	useEffect(() => {
			const load = async () => {
				const storedUser = getUserFromStorage()
				if (storedUser) {
					setUser(storedUser)
					const count = await getNotificationsByUser(storedUser?.user_id)
					setNotificationCount(count?.not_read_count as number)
				}
			}
			load()
		}, [])

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

			<motion.aside animate={{ x: isSidebarOpen ? 0 : -320 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed	top-0	left-0 w-80	h-dvh	bg-white	border-r	border-neutral-200	 z-10 lg:translate-x-0 ${isSidebarOpen ? '' : 'translate-x-[-320px]'}`}>
				<motion.div initial="hidden" animate="visible" className="flex flex-col w-full h-full bg-white">
					<div className="p-6 flex items-center justify-between border-b border-neutral-200">
						<motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold text-red-700">
							My Zone Online
						</motion.h1>
					</div>

					<div  className="hidden lg:flex items-center gap-sm px-sm pt-6 pl-5 pb-2 mb-xl ">
						<div  onClick={() => router.push('/profile')}  className="flex w-[80%] items-center gap-3 p-2 rounded-2xl  cursor-pointer transition-all duration-100 hover:scale-105 ">
							<div className="w-10 h-10  rounded-full flex items-center justify-center">
								{/* <span className="text-white text-sm font-semibold">{user && user.full_name.slice(0, 1).toLocaleUpperCase()}</span> */}
								<img
									alt="Institution logo"
									
									className="w-full h-full rounded-full object-cover"
									src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBvq26wOg0Zi4H-gLYQKJsHN1IhEoteb3j2cn9u__ifA&s=10"
									/>
							</div>
							<div className="">
								<h1 className="font-headline-md text-headline-md font-bold text-primary">{user && user.full_name}</h1>
								<p className="font-label-sm text-label-sm text-text-secondary mt-1">{user && user.role}</p>
							</div>
						</div>
						{notificationCount !== 0 && (
							<button onClick={() => router.push('/notification')} className="relative p-2 rounded-xl  bg-white   transition-all duration-100 hover:scale-105 cursor-pointer">
								<Bell className="w-5 h-5" />
								<span className="absolute -top-3 -right-3 w-6 h-6 text-white bg-red-500 rounded-full border-2 border-white flex items-center justify-center">{notificationCount}</span>
							</button>
						)}
					</div>

					

					<nav className="grow px-4 py-6 overflow-auto flex flex-col justify-between">
						<ul className="space-y-2">
							{menuItems.map((menu, index) => {
								const isDisabled = menu.href.startsWith('#') // hash bilan bosilganda disabled
								return (
									<div key={menu.href} >
										<motion.li  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
										<button
											onClick={() => {
												if (!isDisabled) {
													router.push(menu.href)
													setIsSidebarOpen(false)
												}
											}}
											disabled={isDisabled}
											className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-300 ${
												isActuallyActive(menu.href)
													? 'flex items-center space-x-4 rounded-lg px-4 py-2 font-medium text-neutral-100 scale-105 transition-all duration-200 bg-red-600   active:scale-100 '
													: 'flex items-center space-x-4 rounded-lg px-4 py-2 font-medium text-neutral-600 transition-all duration-200 hover:scale-95 hover:bg-red-200 hover:text-red-700 active:scale-100 '
											} ${isDisabled ? 'cursor-not-allowed opacity-50 hover:bg-none hover:text-neutral-600 hover:shadow-none' : ''}`}
										>
											{menu.icon}
											<span className="font-medium my-2">{menu.name}</span>
											{isActuallyActive(menu.href) && !isDisabled }
										</button>
									</motion.li>
									</div>
									
								)
							})}
						</ul>
						
					</nav>
					

					<div className="p-4 border-t border-neutral-200">
						<Link
							href="/support"
							className={`flex items-center space-x-4 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:scale-95 ${
								pathname === "/support"
								? "flex items-center space-x-4 rounded-lg px-4 py-2 font-medium text-neutral-100 scale-105 transition-all duration-200 bg-red-600   active:scale-100"
								: "text-neutral-600 hover:bg-red-200 hover:text-red-700"
							}`}
							>
							<CircleQuestionMarkIcon size={22} />
								<span className="text-base my-2">Support</span>
							</Link>
						<button
							onClick={clearToken}
							className="flex  w-full items-center space-x-4 mt-2 rounded-lg px-4 py-2 font-medium text-neutral-600 transition-all duration-200 hover:scale-95 hover:bg-red-200 hover:text-red-700 active:scale-100 "
							>
							<LogOut size={22} />
							<span className="text-base my-2">Chiqish</span>
						</button>
					</div>
				</motion.div>
			</motion.aside>
		</>
	)
}