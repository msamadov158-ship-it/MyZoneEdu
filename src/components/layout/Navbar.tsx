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

	return (
		<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full fixed top-0 lg:z-60 bg-white/80 backdrop-blur-xl border-b border-gray-200">
			<div className="px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
							<Menu className="w-5 h-5 cursor-pointer" />
						</button>
						<div className="relative hidden md:block">
							<Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input type="text" placeholder="Qidirish..." className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 ring-blue-500 transition-all duration-300 w-80" />
						</div>
					</div>

					<div className="flex items-center gap-4">
						{notificationCount !== 0 && (
							<button onClick={() => router.push('/notification')} className="relative p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
								<Bell className="w-5 h-5" />
								<span className="absolute -top-3 -right-3 w-6 h-6 text-white bg-red-500 rounded-full border-2 border-white flex items-center justify-center">{notificationCount}</span>
							</button>
						)}

						<motion.div onClick={() => router.push('/profile')} whileHover={{ scale: 1.05 }} className="flex items-center gap-3 p-2 rounded-2xl bg-white shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300">
							<div className="w-8 h-8 bg-myZoneOnline rounded-full flex items-center justify-center">
								<span className="text-white text-sm font-semibold">{user && user.full_name.slice(0, 1).toLocaleUpperCase()}</span>
							</div>
							<div className="hidden md:block">
								<p className="text-sm font-semibold">{user && user.full_name}</p>
								<p className="text-xs text-gray-500">{user && user.role}</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.header>
	)
}
