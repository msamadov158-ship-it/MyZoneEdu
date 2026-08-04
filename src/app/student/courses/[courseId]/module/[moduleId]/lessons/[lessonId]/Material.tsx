'use client'
import { FileText, Download } from 'lucide-react'
import { useLessonMaterials } from '@/hooks/useLessonMaterials'

export default function MaterialTemplate({ lessonId }: { lessonId: string }) {
	const { materials } = useLessonMaterials(lessonId)

	const getFileType = (url = '') => {
		const u = url.toLowerCase()
		// if (u.includes('.pdf')) return 'pdf'
		if (u.includes('.pdf') || u.includes('.doc') || u.includes('.docx') || u.includes('.xls') || u.includes('.xlsx')) return 'download'
		return 'other'
	}

	if (!materials) return null

	// const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
	const isPDF = materials.material_url?.toLowerCase().endsWith('.pdf')

	return (
		// <div className="w-full mx-auto py-6">
		// 	<div className="grid grid-cols-1 gap-6">
		// 		{materials.map((material) => {
		// 			const fileType = getFileType(material.material_url)

		// 			return (
		// 				<div key={material.id} className="bg-white transition-all duration-300 overflow-hidden group rounded-2xl shadow border border-gray-200 p-4">
		// 					{/* PDF Ko‘rinishi */}
		// 					{/* {fileType === 'pdf' && <div className="w-full h-[500px] mb-4 rounded-lg bg-gray-100 overflow-hidden">{isIOS ? <object data={material.material_url} type="application/pdf" className="w-full h-full" /> : <iframe src={`${material.material_url}#toolbar=0&navpanes=0&view=FitH`} title={material.title} className="w-full h-full" style={{ border: 'none' }} />}</div>} */}

		// 					{/* Material Ma’lumotlari */}
		// 					<div className="flex flex-col gap-3">
		// 						<div>
		// 							<h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{material.title}</h3>
		// 							<p className="text-gray-600 text-sm line-clamp-2">{material.description}</p>
		// 						</div>

		// 						{/* Faylni yuklab olish */}
		// 						{fileType === 'download' && (
		// 							<a href={material.material_url} download={material.title} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition rounded">
		// 								📥 Faylni yuklab olish
		// 							</a>
		// 						)}
		// 					</div>
		// 				</div>
		// 			)
		// 		})}
		// 	</div>

		// 	{materials.length === 0 && (
		// 		<div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
		// 			<FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
		// 			<h3 className="text-xl font-semibold text-gray-900 mb-2">Materiallar mavjud emas</h3>
		// 			<p className="text-gray-600">Kurs materiallari mavjud bo‘lganda shu yerga qo‘shiladi</p>
		// 		</div>
		// 	)}
		// </div>

		<div className="w-full mx-auto py-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{materials.map((material) => {
				const fileType = getFileType(material.material_url)
  				const isPDF = material.material_url?.toLowerCase().endsWith('.pdf')

				return (
					<div
					key={material.id}
					className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-red-200 transition-all duration-300 overflow-hidden group flex flex-col"
					>
					{/* Top accent + icon */}
					<div className="flex items-center gap-3 px-5 pt-5">
						<div className="w-11 h-11 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-700 group-hover:text-white transition-colors">
						<FileText className="w-5 h-5" />
						</div>
						<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
						 	{isPDF ? "PDF" : "Fayl"}
						</span>
					</div>

					{/* Material Ma'lumotlari */}
					<div className="flex flex-col gap-2 px-5 pt-4 pb-5 flex-1">
						<h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2">
						{material.title}
						</h3>
						<p className="text-gray-500 text-sm line-clamp-2 flex-1">
						{material.description}
						</p>

						{/* Faylni yuklab olish */}
						{fileType === "download" && (
						
						<a		href={material.material_url}
							download={material.title}
							className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-[0.98] transition-all rounded-xl shadow-sm"
						>
							<Download className="w-4 h-4" />
							Faylni yuklab olish
						</a>
						)}
					</div>
					</div>
				)
				})}
			</div>

			{materials.length === 0 && (
				<div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
				<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-gray-900 mb-2">
					Materiallar mavjud emas
				</h3>
				<p className="text-gray-600">
					Kurs materiallari mavjud bo'lganda shu yerga qo'shiladi
				</p>
				</div>
			)}
			</div>
	)
}
