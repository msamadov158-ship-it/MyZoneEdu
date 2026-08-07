'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTypes } from '@/hooks/useTypes'
import { useRouter } from 'next/navigation'
import { useCourses } from '@/hooks/useCourses'
import { useStudents } from '@/hooks/useStudents'
import { fadeUp, staggeredList } from '@/lib/motion'
import { Users, BookOpen, ChevronRight } from 'lucide-react'

export default function Dashboard() {
	const router = useRouter()
	const { types } = useTypes()
	const { students, loading } = useStudents()
	const { courses, fetchCourses } = useCourses()

	useEffect(() => {
		fetchCourses()
	}, [fetchCourses])

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8 p-4">
			<motion.div
				variants={fadeUp}
				className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#a20000] via-[#c30000] to-[#d00000] p-8 text-white shadow-2xl shadow-[#a20000]/30"
			>
				{/* Ambient glow blobs */}
				<div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
				<div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#ff6b6b]/20 rounded-full blur-3xl"></div>
				<div className="absolute right-1/3 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

				<div className="relative z-10">
					<h1 className="text-3xl font-bold mb-2 tracking-tight">
						Xush kelibsiz, Admin! 👋
					</h1>
					<p className="text-white/70 mb-6">
						Bugun platformangizda nimalar bo‘layotganini ko‘ring.
					</p>
					<button
						onClick={() => router.push('/admin/analytics')}
						className="px-6 py-3 bg-white/15 backdrop-blur-md rounded-xl font-medium hover:bg-white/25 hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-white/20 shadow-lg shadow-black/10"
					>
						Analitikani ko‘rish
					</button>
				</div>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<motion.div onClick={() => router.push('/admin/students')} variants={fadeUp} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 rounded-xl bg-blue-50">
							<Users className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-2">{students.length}</h3>
					<p className="text-gray-600 mb-2">Jami o‘quvchilar</p>
				</motion.div>

				<motion.div onClick={() => router.push('/admin/courses')} variants={fadeUp} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 rounded-xl bg-green-50">
							<BookOpen className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-2">{courses.length}</h3>
					<p className="text-gray-600 mb-2">Jami kurslar</p>
				</motion.div>
			</div>

			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">O‘quvchilar maʼlumotlari yuklanmoqda...</p>
					</div>
				</motion.div>
			) : students.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">O‘quvchilar topilmadi</h3>
					<p className="text-gray-600">Birinchi o‘quvchini qo‘shishdan boshlang</p>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
					<div className="px-6 py-4 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">So‘nggi o‘quvchilar</h3>
							<button onClick={() => router.push('/admin/students')} className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center">
								Barchasini ko‘rish
								<ChevronRight className="w-4 h-4 ml-1" />
							</button>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To‘liq ism</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foydalanuvchi nomi</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tur</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holat</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-gray-200">
								{students.slice(0, 6).map((student, index) => {
									const type = types.find((t) => t.id === student.type_id)

									return (
										<motion.tr key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="hover:bg-gray-50 transition-colors group">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-8 h-8 bg-myZoneOnline rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">{student.full_name.charAt(0)}</div>
													<span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.full_name}</span>
												</div>
											</td>

											<td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.username}</td>

											<td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.phone_number}</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{student.role.toLowerCase()}</span>
											</td>

											<td className="px-6 py-4">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{type?.title || '—'}</span>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{student.is_active ? 'Faol' : 'Faol emas'}</span>
											</td>
										</motion.tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
