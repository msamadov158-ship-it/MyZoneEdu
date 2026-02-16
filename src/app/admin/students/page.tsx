'use client'
import { useState } from 'react'
import { Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTypes } from '@/hooks/useTypes'
import { useModal } from '@/components/UI/Modal'
import { useStudents } from '@/hooks/useStudents'
import { fadeUp, staggeredList } from '@/lib/motion'
import { CreateStudentModal, DeleteStudentModal, EditStudentModal } from './modal'

export default function Students() {
	const { types } = useTypes()
	const { openModal, closeModal } = useModal()
	const { loading, students, fetchStudent, handleCreate, handleUpdate, handleDelete } = useStudents()
	const [selectedType, setSelectedType] = useState('')
	const [searchTerm, setSearchTerm] = useState('')

	const filteredStudents = students.filter((stu) => {
		const matchesType = selectedType ? stu.type_id.toString() === selectedType : true
		const matchesSearch = !searchTerm.trim() || stu.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.username.toLowerCase().includes(searchTerm.toLowerCase()) || (stu.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase())
		return matchesType && matchesSearch
	})

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
		<motion.div variants={staggeredList} initial="hidden" animate="visible" className="space-y-8">
			{loading ? (
				<motion.div variants={fadeUp} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
					<div className="text-center">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Talaba ma’lumotlari yuklanmoqda…</p>
					</div>
				</motion.div>
			) : students.length === 0 ? (
				<motion.div variants={fadeUp} className="text-center py-16 bg-white rounded-2xl shadow-lg">
					<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Talabalar topilmadi</h3>
					<p className="text-gray-600 mb-4">Birinci talabangizni qo‘shish bilan boshlang</p>
					<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
						Talaba qo‘shish
					</button>
				</motion.div>
			) : (
				<motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
					<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
						<h3 className="text-lg font-semibold text-gray-900">Yaqinda qo‘shilgan talabalar</h3>
						<button onClick={handleOpenCreate} className="px-6 py-3 rounded-xl bg-myZoneOnline text-white transition">
							Talaba Qo‘shish
						</button>
					</div>

					<div className="px-6 py-4 border-b border-gray-200 flex gap-4">
						<input type="text" placeholder="Qidirish…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 ring-blue-500 transition-all duration-300 w-full outline-0" />
						<select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="py-3 px-6 bg-gray-50 border-0 rounded-2xl focus:ring-2 ring-blue-500 transition-all duration-300 outline-0">
							<option defaultValue="">--Turini tanlang--</option>
							{types.length &&
								types.map((type) => (
									<option key={type.id} value={type.id}>
										{type.title}
									</option>
								))}
						</select>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">To‘liq ism</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi nomi</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Roli</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
									<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amal</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredStudents.map((student, index) => {
									const type = types.find((t) => t.id == student.type_id)
									return (
										<motion.tr key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 transition-colors group">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-8 h-8 bg-myZoneOnline rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">{student.full_name.charAt(0)}</div>
													<span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{student.full_name}</span>
												</div>
											</td>
											<td className="px-6 py-4 text-gray-600">{student.username}</td>
											<td className="px-6 py-4 text-gray-600">{student.phone_number}</td>
											<td className="px-6 py-4">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{student.role.toUpperCase()}</span>
											</td>
											<td className="px-6 py-4">
												<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{type?.title || '—'}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{student.is_active ? 'Faol' : 'Faol emas'}</span>
											</td>
											<td className="px-6 py-4 flex gap-4 whitespace-nowrap">
												<button onClick={() => handleOpenEdit(student.id)} className="text-indigo-600 hover:text-indigo-800">
													Tahrirlash
												</button>
												<button onClick={() => handleOpenDelete(student.id)} className="text-red-600 hover:text-red-800">
													O‘chirish
												</button>
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
