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
	const { students, loading, totalCount } = useStudents()
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
					<h3 className="text-2xl font-bold text-gray-900 mb-2">{totalCount}</h3>
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
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Roli</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-gray-200">
								{students.map((student, index) => {
									const type = types.find((t) => t.id === student.type_id)

									return (
										<motion.tr key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="hover:bg-gray-50 transition-colors group">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-8 h-8 bg-myZoneOnline rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3"><img className='w-full h-full rounded-full object-center' src="data:image/jpeg;base64,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" alt="" /></div>
													<span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.full_name} <br /> <span className='font-normal text-gray-500'> {student.username}</span></span>
												</div>
											</td>



											<td className="px-6 py-4">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-800 capitalize">{student.role.toLowerCase()}</span>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center gap-2 text-xs font-medium ${
													student.is_active ? "text-green-700" : "text-red-700"
													}`}
												>
													<span
													className={`w-2 h-2 rounded-full ${
														student.is_active ? "bg-green-500" : "bg-red-500"
													}`}
													/>

													{student.is_active ? "Faol" : "Faol emas"}
												</span>
											</td>

											<td className="px-6 py-4">
												<div className={`inline-flex items-center gap-2 text-xs font-medium capitalize ${
													type?.title?.toLowerCase() === "online"
														? "text-green-700"
														: type?.title?.toLowerCase() === "offline"
														? "text-red-700"
														: "text-blue-700"
													}`}
												>
													<span className={`w-2 h-2 rounded-full ${
														type?.title?.toLowerCase() === "online"
														? "bg-green-500"
														: type?.title?.toLowerCase() === "offline"
														? "bg-red-500"
														: "bg-blue-500"
													}`}
													/>

													{type?.title || "—"}
												</div>
											</td>

											<td className="px-6 py-4 text-gray-600">{student.phone_number}</td>
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
