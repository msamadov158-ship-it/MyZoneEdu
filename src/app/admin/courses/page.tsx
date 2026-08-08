'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Edit, Trash2 } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { useModal } from '@/components/UI/Modal'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateCourseModal, DeleteCourseModal, EditCourseModal } from './modal'

export default function CoursesPage() {
	const router = useRouter()
	const { openModal, closeModal } = useModal()
	const { loading, courses, fetchCourse, createCourse, updateCourse, deleteCourse } = useCourses()

	const handleOpenCreate = () => {
		openModal({
			type: 'CREATE',
			formId: 'courseCreate',
			title: 'Kurs Yaratish',
			btnTitle: 'Yaratish',
			content: <CreateCourseModal closeModal={closeModal} handleCreate={createCourse} />,
		})
	}

	const handleOpenEdit = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'courseEdit',
			title: 'Kursni Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditCourseModal id={id} closeModal={closeModal} fetchCourse={fetchCourse} handleUpdate={updateCourse} />,
		})
	}

	const handleOpenDelete = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'courseDelete',
			title: 'Kursni O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteCourseModal id={id} closeModal={closeModal} handleDelete={deleteCourse} />,
		})
	}

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8 p-6">
			{loading ? (
				<motion.div  className="relative w-full  flex items-center justify-center h-64 rounded-2xl overflow-hidden
										bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
							
							<div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
							<div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

							<div className="relative text-center">
								<div className="relative w-16 h-16 mx-auto mb-4">
									<div className="absolute inset-0 rounded-full border-4 border-[#a20000]/15" />
									<div className="absolute inset-0 rounded-full border-4 border-t-[#a20000] border-r-[#d00000] border-b-transparent border-l-transparent animate-spin" />
								</div>
								<p className="text-gray-600">
									Kurs malumotlari yuklanmoqda...
								</p>
							</div>
					</motion.div>
			) : courses.length === 0 ? (
				<div className="relative w-full  flex items-center justify-center h-70 rounded-2xl overflow-hidden
                             bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
                
						<div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
						<div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

						<div className="relative flex flex-col justify-center items-center">
							<BookOpen className='w-16 h-16 text-red-600 mb-4'/>
							<p className="text-gray-600">
								Kurslar topilmadi
							</p>
							<p className="text-gray-600">
								Birinchi kursingizni qo'shishdan boshlang
							</p>
							<button onClick={handleOpenCreate} className="px-6 py-3 my-4 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
								Talaba qo‘shish
				 			</button>
						</div>
					</div>
			) : (
				<motion.div variants={fadeUp} className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Barcha Kurslar</h2>
							<p className="text-gray-600 mt-1">Ta'lim kontentingizni boshqaring</p>
						</div>
						<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition">
							Kurs Qo‘shish
						</button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{courses.map((course, index) => (
							<motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
								<div className="relative h-56 bg-myZoneOnline overflow-hidden">
									{course.image_url ? (
										<Image src={course.image_url} alt={course.title} width={100} height={100} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<BookOpen className="w-12 h-12 text-white opacity-80" />
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>

								<div className="p-5">
									<div className="flex items-center justify-between mb-3">
										<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{course.level || 'Umumiy'}</span>
									</div>

									<h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>

									<p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description.slice(0, 50) || 'Tavsif mavjud emas'}</p>

									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<div className="flex items-center gap-2">
											<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEdit(course.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Kursni tahrirlash">
												<Edit className="w-4 h-4" />
											</motion.button>
											<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Kursni o‘chirish">
												<Trash2 className="w-4 h-4" />
											</motion.button>
										</div>

										<motion.button onClick={() => router.push(`/admin/courses/${course.id}`)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
											Tafsilotlarni ko‘rish
										</motion.button>
									</div>
								</div>

								<div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}