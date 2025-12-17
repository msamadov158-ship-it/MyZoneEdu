'use client'
import { FileText } from 'lucide-react'
import { useLessonMaterials } from '@/hooks/useLessonMaterials'

export default function MaterialTemplate({ lessonId }: { lessonId: string }) {
	const { materials } = useLessonMaterials(lessonId)

	const getFileType = (url = '') => {
		const u = url.toLowerCase()

		if (u.includes('.pdf')) return 'pdf'
		if (u.includes('.doc') || u.includes('.docx') || u.includes('.xls') || u.includes('.xlsx')) return 'download'

		return 'other'
	}

	return (
		<div className="w-full mx-auto p-6">
			<div className="grid grid-cols-1 gap-6">
				{materials.map((material) => {
					const fileType = getFileType(material.material_url)

					return (
						<div key={material.id} className="bg-white transition-all duration-300 overflow-hidden group">
							{fileType === 'pdf' && (
								<div className="relative aspect-video bg-gray-100 overflow-hidden rounded">
									<iframe src={`${material.material_url}#toolbar=0&navpanes=0&scrollbar=0`} title={material.title} className="w-full h-full" />
								</div>
							)}

							{/* CONTENT */}
							<div className="flex flex-col gap-3 mt-3">
								<div>
									<h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{material.title}</h3>
									<p className="text-gray-600 text-sm line-clamp-2">{material.description}</p>
								</div>

								{/* DOWNLOAD ONLY */}
								{fileType === 'download' && (
									<a href={material.material_url} download={material.title} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition rounded">
										📥 Download file
									</a>
								)}
							</div>
						</div>
					)
				})}
			</div>

			{materials.length === 0 && (
				<div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
					<FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">No materials available</h3>
					<p className="text-gray-600">Course materials will be added here once available</p>
				</div>
			)}
		</div>
	)
}
