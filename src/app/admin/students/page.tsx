'use client'
import { useEffect, useState } from 'react'
import { Users, Download, UserPlus,Search, EllipsisVertical, Edit2, Trash2, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react'
import {AnimatePresence ,motion } from 'framer-motion'
import { useTypes } from '@/hooks/useTypes'
import { useModal } from '@/components/UI/Modal'
import { useStudents } from '@/hooks/useStudents'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateStudentModal, DeleteStudentModal, EditStudentModal } from './modal'

export default function Students() {
	const { types } = useTypes()
	const { openModal, closeModal } = useModal()
	const { loading, students, page, setPage, perPage, allStudents,fetchStudent, handleCreate, handleUpdate, handleDelete } = useStudents()
	const [selectedType, setSelectedType] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [openId, setOpenId] = useState<string | null>(null)

	const filteredStudents = allStudents.filter((stu) => {
		 const matchesType = selectedType ? stu.type_id.toString() === selectedType : true
		const matchesSearch = !searchTerm.trim()
			|| stu.full_name.toLowerCase().includes(searchTerm.toLowerCase())
			|| stu.username.toLowerCase().includes(searchTerm.toLowerCase())
			|| (stu.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase())
		return matchesType && matchesSearch
		
	})

	const totalCount = filteredStudents.length
	const start = (page - 1) * perPage
	const paginatedStudents = filteredStudents.slice(start, start + perPage)

	useEffect(() =>{
		setPage(1)
	}, [searchTerm, selectedType])

	const handleOpenCreate = () => {
		openModal({
			type: 'CREATE',
			formId: 'studentCreate',
			title: 'Talaba Qo‘shish',
			btnTitle: 'Yaratish',
			content: <CreateStudentModal closeModal={closeModal} handleCreate={handleCreate} />,
		})
	}

	const handleOpenEdit = (id: string) => {
		openModal({
			type: 'EDIT',
			formId: 'studentEdit',
			title: 'Talabani Tahrirlash',
			btnTitle: 'Saqlash',
			content: <EditStudentModal id={id} closeModal={closeModal} fetchStudent={fetchStudent} handleUpdate={handleUpdate} />,
		})
	}

	const handleOpenDelete = (id: string) => {
		openModal({
			type: 'DELETE',
			formId: 'studentDelete',
			title: 'Talabani O‘chirish',
			btnTitle: 'O‘chirish',
			content: <DeleteStudentModal id={id} closeModal={closeModal} handleDelete={handleDelete} />,
		})
	}

	return (
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8 p-4">
			{/* loading done */}
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
									Talaba malumotlari yuklanmoqda...
								</p>
							</div>
					</motion.div>
			) : students.length === 0 ? (
				// students none done
				<div className="relative w-full  flex items-center justify-center h-70 rounded-2xl overflow-hidden
                             bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
                
						<div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
						<div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

						<div className="relative flex flex-col justify-center items-center">
							<Users className='w-16 h-16 text-red-600 mb-4'/>
							<p className="text-gray-600">
								Talabalar topilmadi
							</p>
							<p className="text-gray-600">
								Birinchi talabangizni qo'shishdan boshlang
							</p>
							<button onClick={handleOpenCreate} className="px-6 py-3 my-2 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
								Talaba qo‘shish
				 			</button>
						</div>
					</div>
			) : (
				<motion.div variants={fadeUp} className="overflow-hidden border border-gray-100">
					{/* teppasi */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-semibold text-gray-900">Foydalanuvchilarni boshqarish</h1>
							<p className="text-gray-500 mt-1">Platformadagi barcha foydalanuvchilarni boshqaring va kuzating</p>
						</div>
						<div className="flex gap-3">
							<button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
								<Download className="w-4 h-4" />
								<span className="text-sm font-medium">Yuklab olish</span>
							</button>
							<button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
								<UserPlus className="w-4 h-4" />
								<span className="text-sm font-medium">Talaba Qo‘shish</span>
							</button>
						</div>
					</div>

				{/* search filter  */}
					<div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
						<div className="flex flex-wrap gap-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									placeholder="Qidirish…"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm"
								/>
							</div>
							<select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm text-gray-700">
								<option defaultValue="">--Turini tanlang--</option>
								{types.length &&
									types.map((type) => (
										<option key={type.id} value={type.id}>
											{type.title}
										</option>
									))}
							</select>
						</div>
						<div className="flex justify-end">
							<p className="text-gray-500 text-sm">Jami talabalar soni: {totalCount}</p>
						</div>
					</div>

					<div className="overflow-x-auto my-5 ">
						<table className="w-full rounded-2xl  bg-white">
							<thead className=' bg-gray-200 rounded-t-2xl '>
								<tr className='rounded-t-2xl'>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Roli</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amal</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{paginatedStudents.map((student, index) => {
									const type = types.find((t) => t.id == student.type_id)
									openId === student.id
									return (
										<motion.tr key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 transition-colors group">
											 <td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-8 h-8 bg-myZoneOnline rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3"><img className='w-full h-full rounded-full object-center' src="data:image/jpeg;base64,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" alt="" /></div>
													<span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.full_name} <br /> <span className='font-normal text-gray-500'> {student.username}</span></span>
												</div>
											</td>
											{/* <td className="px-6 py-4 text-gray-600">{student.username}</td> */}
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
											
											<td className="px-6 py-4 relative whitespace-nowrap">
												<div className="relative inline-block">
													<button
														onClick={() => setOpenId((prev) => (prev === student.id ? null : student.id))}
														className="flex items-center rounded p-2 cursor-pointer hover:bg-gray-100 transition-colors"
														>
														<EllipsisVertical className="w-4 h-4 text-gray-500" />
													</button>

													<AnimatePresence>
														{openId === student.id && (
															<motion.div
																initial={{ opacity: 0, scale: 0.8, x: 60, y:10 }}
																animate={{ opacity: 1, scale: 1, x: 60, y:-40 }}
																exit={{ opacity: 0, scale: 0.8, x: 60, y:10 }}
																transition={{ duration: 0.2 }}
																className="absolute right-full top-1/2 -translate-y-1/2 mr-2 flex items-center gap-3 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 z-10">
																<button onClick={() => handleOpenEdit(student.id)} className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" title='Tahrirlash' >
																	<Edit2 className="w-4 h-4" />
																</button>
																<button onClick={() => handleOpenDelete(student.id)} className="text-red-600 hover:text-red-800 transition-colors cursor-pointer" title="O'chirish">
																	<Trash2 className="w-4 h-4" />
																</button>
															</motion.div>
														)}
													</AnimatePresence>
												</div>
											</td>
										</motion.tr>
									)
								})}
							</tbody>
						</table>

						<div className="w-full flex justify-between items-center border-t border-gray-200 py-3 px-6">
							<div>
								<span className="text-sm text-gray-500">
									{page}-sahifa, {perPage} tadan, jami {totalCount} ta
								</span>
							</div>

							<div className="flex rounded-lg border border-gray-200 overflow-hidden">
								<button onClick={() => setPage(page - 1)} className="p-3 hover:bg-gray-100 hover:text-red-600 hover:scale-105 cursor-pointer transition-colors border-r border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-300" disabled={page===1} >
									<ArrowLeftToLine className="w-4 h-4" />
								</button>
								<button onClick={() => setPage(page + 1)} className="p-3 hover:bg-gray-100 hover:text-red-600 hover:scale-105 cursor-pointer transition-colors">
									<ArrowRightToLine className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
