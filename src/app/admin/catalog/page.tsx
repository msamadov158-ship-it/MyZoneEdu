'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Edit, Trash2, Download, ArrowUpRight, Pencil, Code, DatabaseZap, Palette, Plus } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { useModal } from '@/components/UI/Modal'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateCourseModal, DeleteCourseModal, EditCourseModal } from '../courses/modal'

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
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">

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
                <div className="max-w-350 mx-auto space-y-6">
				{/* Sarlavha */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
					<div>
						<h2 className="text-3xl font-semibold text-gray-900 mb-2">Kurslar Katalogi</h2>
						<p className="text-gray-500">Kurs takliflarini boshqaring, ro‘yxatga olish ko‘rsatkichlarini kuzating va yangilanishlarni chop eting.</p>
					</div>
					<div className="flex items-center gap-3 w-full md:w-auto">
						<button className="px-4 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
							<Plus className="w-4 h-4" />
							Yangilanishlarni chop etish
						</button>
					</div>
				</div>

				{/* Statistika */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-2 text-gray-500 mb-2">
							<span className="text-sm uppercase font-medium tracking-wide">Jami kurslar</span>
						</div>
						<div className="text-4xl font-bold text-gray-900">124</div>
					</div>
					<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-2 text-gray-500 mb-2">
							<span className="text-sm uppercase font-medium tracking-wide">Faol talabalar</span>
						</div>
						<div className="text-4xl font-bold text-gray-900">14.2k</div>
					</div>
					<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-2 text-gray-500 mb-2">
							<span className="text-sm uppercase font-medium tracking-wide">O‘rtacha tugallanish</span>
						</div>
						<div className="text-4xl font-bold text-gray-900">78%</div>
					</div>
					<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-2 text-gray-500 mb-2">
							<span className="text-sm uppercase font-medium tracking-wide">Yillik daromad</span>
						</div>
						<div className="text-4xl font-bold text-gray-900">$2.4M</div>
					</div>
				</div>

				{/* Jadval */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
					{/* Toolbar */}
					<div className="flex items-center justify-end p-4 border-b border-gray-200">
						<button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors">
							<Download className="w-5 h-5" />
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse min-w-[900px]">
							<thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
								<tr>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kurs nomi va ID</th>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Holat</th>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Talabalar</th>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tugallanish</th>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Daromad</th>
									<th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amallar</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{/* Qator 1 */}
								<tr className="hover:bg-gray-50 transition-colors group">
									<td className="py-4 px-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded border border-gray-200 bg-red-50 flex items-center justify-center text-red-600">
												<Code className="w-5 h-5" />
											</div>
											<div>
												<div className="font-medium text-gray-900">Ilg‘or Mashinaviy O‘qitish Arxitekturasi</div>
												<div className="text-sm text-gray-500">CS-401 • Prof. Alan Turing</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-4">
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
											<span className="w-1.5 h-1.5 rounded-full bg-red-600" />
											Chop etilgan
										</span>
									</td>
									<td className="py-4 px-4">
										<div className="text-gray-900 font-medium">1,245</div>
										<div className="text-xs text-gray-400">Shu hafta +12</div>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											<div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
												<div className="h-full bg-red-600 rounded-full" style={{ width: '82%' }} />
											</div>
											<span className="text-sm text-gray-500">82%</span>
										</div>
									</td>
									<td className="py-4 px-4 text-gray-900 font-medium">$124,500</td>
									<td className="py-4 px-4 text-right">
										<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all" title="Tahrirlash">
												<Pencil className="w-4 h-4" />
											</button>
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all" title="Batafsil ko‘rish">
												<ArrowUpRight className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>

								{/* Qator 2 */}
								<tr className="hover:bg-gray-50 transition-colors group">
									<td className="py-4 px-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500">
												<DatabaseZap className="w-5 h-5" />
											</div>
											<div>
												<div className="font-medium text-gray-900">Rust’da Ma’lumotlar Tuzilmalari</div>
												<div className="text-sm text-gray-500">CS-302 • Dr. Grace Hopper</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-4">
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
											<span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
											Qoralama
										</span>
									</td>
									<td className="py-4 px-4">
										<div className="text-gray-900 font-medium">0</div>
										<div className="text-xs text-gray-400">Boshlanmagan</div>
									</td>
									<td className="py-4 px-4">
										<span className="text-sm text-gray-400">—</span>
									</td>
									<td className="py-4 px-4 text-gray-900 font-medium">$0</td>
									<td className="py-4 px-4 text-right">
										<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all">
												<Pencil className="w-4 h-4" />
											</button>
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all">
												<ArrowUpRight className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>

								{/* Qator 3 */}
								<tr className="hover:bg-gray-50 transition-colors group">
									<td className="py-4 px-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded border border-gray-200 bg-red-50 flex items-center justify-center text-red-600">
												<Palette className="w-5 h-5" />
											</div>
											<div>
												<div className="font-medium text-gray-900">UI/UX Dizayn Tizimlari Muhandisligi</div>
												<div className="text-sm text-gray-500">DES-205 • Sarah Connor</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-4">
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
											<span className="w-1.5 h-1.5 rounded-full bg-red-600" />
											Chop etilgan
										</span>
									</td>
									<td className="py-4 px-4">
										<div className="text-gray-900 font-medium">3,402</div>
										<div className="text-xs text-gray-400">Shu hafta +45</div>
									</td>
									<td className="py-4 px-4">
										<div className="flex items-center gap-2">
											<div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
												<div className="h-full bg-red-600 rounded-full" style={{ width: '65%' }} />
											</div>
											<span className="text-sm text-gray-500">65%</span>
										</div>
									</td>
									<td className="py-4 px-4 text-gray-900 font-medium">$340,200</td>
									<td className="py-4 px-4 text-right">
										<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all">
												<Pencil className="w-4 h-4" />
											</button>
											<button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded transition-all">
												<ArrowUpRight className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="p-4 border-t border-gray-200 flex items-center justify-between">
						<span className="text-sm text-gray-500">124 tadan 1–10 ko‘rsatilmoqda</span>
						<div className="flex items-center gap-1">
							<button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50" disabled>
								Oldingi
							</button>
							<button className="px-3 py-1 border border-red-600 rounded bg-red-600 text-white font-medium text-sm">1</button>
							<button className="px-3 py-1 border border-gray-200 rounded text-gray-900 hover:bg-gray-50 transition-colors text-sm">2</button>
							<button className="px-3 py-1 border border-gray-200 rounded text-gray-900 hover:bg-gray-50 transition-colors text-sm">3</button>
							<span className="px-2 text-gray-400">...</span>
							<button className="px-3 py-1 border border-gray-200 rounded text-gray-900 hover:bg-gray-50 transition-colors text-sm">Keyingi</button>
						</div>
					</div>
				</div>
			</div>
            )}

			
		</main>
    )
}