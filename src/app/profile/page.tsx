'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Edit3, Save, X, User, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { StudentEdit } from '@/types'
import { cardVariants } from '@/lib/motion'
import { useStudents } from '@/hooks/useStudents'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export default function ProfilePage() {
	const router = useRouter()
	const { handleUpdate, fetchStudent } = useStudents()

	const [isEditMode, setIsEditMode] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [isFetchingData, setIsFetchingData] = useState(true)
	const [userData, setUserData] = useState<StudentEdit | null>(null)

	const userId = getUserFromStorage()?.user_id

	useEffect(() => {
		const loadStudentData = async () => {
			setIsFetchingData(true)
			const res = await fetchStudent(userId as string)
			if (res) setUserData(res)
			setIsFetchingData(false)
		}
		loadStudentData()
	}, [fetchStudent, userId])

	const handleSave = () => {
		setIsEditMode(false)
		handleUpdate(userId as string, userData as StudentEdit)
	}

	const handleCancel = () => {
		setIsEditMode(false)
	}

	if (isFetchingData) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
				<div className="text-white">{isFetchingData ? 'Yuklanmoqda...' : "Ma'lumot topilmadi"}</div>
			</div>
		)
	}

	const handleChange = <K extends keyof StudentEdit>(field: K, value: StudentEdit[K]) => {
		setUserData((prev) => {
			if (!prev) return prev
			return { ...prev, [field]: value }
		})
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
					<div className="flex items-center gap-4">
						<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.back()} className="p-2 bg-gray-100 rounded-xl">
							<ArrowLeft className="w-5 h-5" />
						</motion.button>

						<div>
							<h1 className="text-3xl font-bold text-gray-900">Profil sozlamalari</h1>
							<p className="text-gray-600 mt-2">Hisobingiz maʼlumotlarini boshqaring</p>
						</div>
					</div>

					{!isEditMode ? (
						<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsEditMode(true)} className="px-6 py-3 bg-myZoneOnline text-white rounded-xl shadow-lg flex items-center gap-2">
							<Edit3 className="w-4 h-4" />
							Profilni tahrirlash
						</motion.button>
					) : (
						<div className="flex gap-3">
							<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-2">
								<Save className="w-4 h-4" />
								Saqlash
							</motion.button>

							<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCancel} className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow-lg flex items-center gap-2">
								<X className="w-4 h-4" />
								Bekor qilish
							</motion.button>
						</div>
					)}
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
								<User className="w-5 h-5 text-blue-600" />
								Shaxsiy maʼlumotlar
							</h2>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">To‘liq ism</label>
									{isEditMode ? <input type="text" value={userData?.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="w-full px-4 py-3 border rounded-xl" /> : <p className="px-4 py-3 bg-gray-50 rounded-xl">{userData?.full_name}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Foydalanuvchi nomi</label>
									{isEditMode ? <input type="text" value={userData?.username} onChange={(e) => handleChange('username', e.target.value)} className="w-full px-4 py-3 border rounded-xl" /> : <p className="px-4 py-3 bg-gray-50 rounded-xl">@{userData?.username}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Telefon raqam</label>
									{isEditMode ? <input type="tel" value={userData?.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} className="w-full px-4 py-3 border rounded-xl" /> : <p className="px-4 py-3 bg-gray-50 rounded-xl">{userData?.phone_number}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Parol</label>
									{isEditMode ? (
										<div className="relative">
											<input type={showPassword ? 'text' : 'password'} value={userData?.password} onChange={(e) => handleChange('password', e.target.value)} className="w-full px-4 py-3 border rounded-xl" />
											<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
												{showPassword ? <EyeOff /> : <Eye />}
											</button>
										</div>
									) : (
										<p className="px-4 py-3 bg-gray-50 rounded-xl">••••••••</p>
									)}
								</div>
							</div>
						</motion.div>
					</div>

					<div className="space-y-6">
						<motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
							<h3 className="text-lg font-semibold mb-4">Hisob holati</h3>

							<div className="space-y-4">
								<div className="flex justify-between bg-gray-50 p-4 rounded-xl">
									<span>Holat</span>
									{userData?.is_active ? (
										<span className="text-green-600 flex gap-2">
											<CheckCircle /> Faol
										</span>
									) : (
										<span className="text-red-600 flex gap-2">
											<XCircle /> Faol emas
										</span>
									)}
								</div>

								<div className="flex justify-between bg-gray-50 p-4 rounded-xl">
									<span>Faol muddat</span>
									<span>{userData?.active_term}</span>
								</div>

								<div className="flex justify-between bg-gray-50 p-4 rounded-xl">
									<span>Oxirgi yangilanish</span>
									<span>Bugun</span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}
