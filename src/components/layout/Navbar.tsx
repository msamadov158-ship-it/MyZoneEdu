import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { StoredAuth } from '@/types'
import { Bell, Menu, Search } from 'lucide-react'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { useNotifications } from '@/hooks/useNotifications'

export default function Navbar({ setIsSidebarOpen }: { setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	const router = useRouter()
	const [user, setUser] = useState<StoredAuth | null>(null)
	const [notificationCount, setNotificationCount] = useState<number>(0)
	const { getNotificationsByUser } = useNotifications()
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const load = async () => {
			const storedUser = getUserFromStorage()
			if(storedUser?.role === 'ADMIN') {
				setIsAdmin(true)
			}
			if (storedUser) {
				setUser(storedUser)
				const count = await getNotificationsByUser(storedUser?.user_id)
				setNotificationCount(count?.not_read_count as number)
			}
		}
		load()
	}, [])

	return (
		<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 ${!isAdmin && 'lg:hidden'} `}>
			<div className="px-6 py-2 ">
				<div className="flex items-center justify-between">
					{/* side bar ochib yopgich */}
					<div className="flex items-center gap-4">
						<button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-white  transition-all duration-300">
							<Menu className="w-6 h-6 cursor-pointer" />
						</button>

						{/* search */}
						{/* <div className="relative hidden md:block">
							<Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input type="text" placeholder="Qidirish..." className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 ring-blue-500 transition-all duration-300 w-80" />
						</div> */}
					</div>

					<div className="flex items-center gap-4">
						
							<button
								onClick={() => router.push("/notification")}
								className="relative flex items-center justify-center p-2.5 rounded-xl bg-white text-gray-600  border-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200"
								title="Bildirishnomalar"
								>
								<Bell className="w-5 h-5" />

								{notificationCount > 0 && (
									<span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 text-[11px] font-semibold text-white bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
										{notificationCount > 99 ? "99+" : notificationCount}
									</span>
								)}
							</button>	
						

						<motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-sm px-sm pl-5 pb-2 mb-xl " title='Foydalanuvchi profili'>
							<div onClick={() => router.push('/profile')}  className="flex w-[90%] items-center gap-3 p-2 rounded-2xl  cursor-pointer transition-all duration-300">
								<div className="w-10 h-10  rounded-full flex items-center justify-center">
									{/* <span className="text-white text-sm font-semibold">{user && user.full_name.slice(0, 1).toLocaleUpperCase()}</span> */}
									<img
										alt="Institution logo"
										className="w-10 h-10 rounded-full object-cover"
										src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBvq26wOg0Zi4H-gLYQKJsHN1IhEoteb3j2cn9u__ifA&s=10"
										/>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.header>
	)
}
