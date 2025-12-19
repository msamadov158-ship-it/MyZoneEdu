'use client'

import React from 'react'
import { Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
	onClose: () => void
	title: string
	formId?: string
	btnTitle: string
	type: 'EDIT' | 'DELETE' | 'CREATE' | 'INFO'
	content?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ onClose, title, type, btnTitle = 'Submit', content, formId = 'modal-form' }) => {
	return (
		<AnimatePresence>
			<motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<motion.div className="bg-white h-auto max-h-130 overflow-y-auto scroll-none rounded-2xl w-full max-w-2xl shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}>
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
						</div>
						<button onClick={onClose} className="p-2 hover:bg-gray-100  rounded-xl transition-colors">
							<X className="w-6 h-6 text-gray-800" />
						</button>
					</div>

					{content}

					<div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
						<button type="button" onClick={onClose} className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:text-gray-800 transition-colors cursor-pointer">
							Bekor qilish
						</button>
						{type === 'DELETE' && (
							<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" form={formId} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
								<Trash2 className="w-4 h-4" /> {btnTitle}
							</motion.button>
						)}

						{['EDIT', 'CREATE', 'INFO'].includes(type) && (
							<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" form={formId} className="px-6 py-3 bg-myZoneOnline text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg cursor-pointer">
								{btnTitle}
							</motion.button>
						)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
