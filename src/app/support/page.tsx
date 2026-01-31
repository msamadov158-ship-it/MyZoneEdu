'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, File, Play, Send, X, Check, Plus } from 'lucide-react'

import { Message } from '@/types'
import { useSupport } from '@/hooks/useSupport'
import { getUserFromStorage } from '@/lib/helpers/userStore'

import { Welcome } from './components/Welcome'
import { TicketList } from './components/TicketList'
import { StatusBadge } from './components/StatusBadge'
import { MessageBubble } from './components/MessageBubble'
import { TypingIndicator } from './components/TypingIndicator'
import { FileUploader } from '@/components/UI/SupportFileUploader'

export default function SupportPage() {
	const [user, setUser] = useState<ReturnType<typeof getUserFromStorage> | null>(() => getUserFromStorage())
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const [showNewTicketForm, setShowNewTicketForm] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [newTicketMessage, setNewTicketMessage] = useState('')

	useEffect(() => {
		function syncUser() {
			setUser(getUserFromStorage())
		}
		syncUser()
		window.addEventListener('storage', syncUser)
		return () => {
			window.removeEventListener('storage', syncUser)
		}
	}, [])

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 1024)
		check()
		window.addEventListener('resize', check)
		return () => window.removeEventListener('resize', check)
	}, [])

	const role = user?.role || 'STUDENT'
	const [replyMessage, setReplyMessage] = useState('')
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
	const [editingMessage, setEditingMessage] = useState<Message | null>(null)
	const [editMessageText, setEditMessageText] = useState('')
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const { tickets, loading, selectedTicket, messages, typingUserId, handleTyping, setSelectedTicket, fetchMessages, sendMessage, createTicket, editMessage, deleteMessage } = useSupport()

	const primaryColor = role === 'STUDENT' ? 'purple' : 'indigo'
	const buttonGradient = role === 'STUDENT' ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500'
	const headerGradient = role === 'STUDENT' ? 'from-purple-50 to-pink-50' : 'from-indigo-50 to-purple-50'
	const messagesGradient = `from-gray-50 to-${primaryColor}-50/30`

	// Desktop uchun: birinchi ticketni avtomatik tanlash
	useEffect(() => {
		if (!isMobile && tickets.length > 0 && !selectedTicket) {
			setSelectedTicket(tickets[0])
			fetchMessages(tickets[0].id)
		}
	}, [tickets, selectedTicket, isMobile, setSelectedTicket, fetchMessages])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom()
		}
	}, [messages])

	const handleCreateTicket = async () => {
		if ((!newTicketMessage.trim() && !uploadedFileUrl) || loading) return

		const ticketId = await createTicket(newTicketMessage, uploadedFileUrl || undefined)
		if (ticketId) {
			setNewTicketMessage('')
			setUploadedFileUrl(null)
			setShowNewTicketForm(false)
		}
	}

	const handleSendReply = async () => {
		if ((!replyMessage.trim() && !uploadedFileUrl) || !selectedTicket) return
		const studentIdToUse = role === 'STUDENT' ? undefined : selectedTicket.student_id
		const success = await sendMessage(selectedTicket.id, replyMessage, studentIdToUse, uploadedFileUrl || undefined)
		if (success) {
			setReplyMessage('')
			setUploadedFileUrl(null)
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		}
	}

	const handleEditMessage = (msg: Message) => {
		setEditingMessage(msg)
		setEditMessageText(msg.message)
	}

	const handleSaveEdit = async () => {
		if (!editingMessage || !selectedTicket) return
		const success = await editMessage(editingMessage.id, selectedTicket.id, editMessageText)
		if (success) {
			setEditingMessage(null)
			setEditMessageText('')
		}
	}

	const handleDeleteMessage = async (msg: Message) => {
		if (!selectedTicket) return
		if (!confirm('Xabarni o\'chirmoqchimisiz?')) return
		await deleteMessage(msg.id)
	}

	const getFileTypeFromUrl = (url: string) => {
		if (url.match(/\.(png|jpg|jpeg|webp|gif)$/i)) return 'image'
		if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return 'video'
		return 'document'
	}

	const uploadedFilePreview = () => {
		if (!uploadedFileUrl) return null
		const type = getFileTypeFromUrl(uploadedFileUrl)
		return (
			<div className="relative w-20 h-20 mb-3 rounded-xl bg-gray-50">
				<button onClick={() => setUploadedFileUrl(null)} className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 rounded-full p-1 shadow-lg cursor-pointer transition-colors">
					<X className="w-4 h-4 text-white" />
				</button>
				{type === 'image' && (
					<Image src={uploadedFileUrl} alt="preview" width={80} height={80} className="w-full h-full object-cover rounded-xl" />
				)}
				{type === 'video' && (
					<div className="w-full h-full relative flex items-center justify-center bg-black rounded-xl overflow-hidden">
						<video src={uploadedFileUrl} className="w-full h-full object-cover" muted />
						<Play className="absolute w-6 h-6 text-white opacity-80" />
					</div>
				)}
				{type === 'document' && (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 rounded-xl">
						<File className="w-6 h-6" />
						<span className="text-[10px] mt-1 text-center">Fayl</span>
					</div>
				)}
			</div>
		)
	}

	const shouldShowTyping = typingUserId != null && user && typingUserId !== user.user_id

	// Mobil uchun: ticket/inbox list yoki ticket form ko'rsatish
	const showMobileList = isMobile && !selectedTicket && !showNewTicketForm

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto scroll-none rounded-2xl">
			{/* Chap panel - Ticket list (desktopda doim, mobilida faqat list ko'rsatilganda) */}
			<div className={`bg-white rounded-2xl shadow-xl p-4 h-full overflow-y-auto scroll-none min-h-[500px] ${isMobile && (selectedTicket || showNewTicketForm) ? 'hidden' : ''}`}>
				{role === 'STUDENT' && (
					<button
						onClick={() => {
							setShowNewTicketForm(true)
							setSelectedTicket(null)
						}}
						className="mb-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl flex justify-center gap-2"
					>
						<Plus className="w-5 h-5" />
						Yangi Savol
					</button>
				)}

				<TicketList
					userRole={role}
					tickets={tickets}
					selectedTicket={selectedTicket}
					currentUserId={user?.user_id as string}
					loading={loading}
					onSelectTicket={(t) => {
						setSelectedTicket(t)
						setShowNewTicketForm(false)
						fetchMessages(t.id)
					}}
				/>
			</div>

			{/* O'ng panel - Ticket form yoki chat */}
			<div className={`lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col h-full min-h-[500px] ${showMobileList ? 'hidden lg:flex' : ''}`}>
				{showNewTicketForm ? (
					<>
						<div className={`p-4 border-b-2 border-gray-100 bg-gradient-to-r ${headerGradient}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<button
										onClick={() => {
											setShowNewTicketForm(false)
											setSelectedTicket(null)
										}}
										className="p-2 hover:bg-white rounded-lg transition-colors lg:hidden"
									>
										<ChevronLeft className="w-5 h-5" />
									</button>

									<h2 className="font-bold text-gray-900">
										Yangi Savol
									</h2>
								</div>
							</div>
						</div>

						<div className={`flex-1 p-6 bg-gradient-to-br ${messagesGradient}`}>
							<textarea
								placeholder="Savol matnini yozing..."
								value={newTicketMessage}
								onChange={(e) => setNewTicketMessage(e.target.value)}
								className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors resize-none"
							/>
						</div>

						<div className="p-4 border-t-2 border-gray-100 bg-white">
							{uploadedFilePreview()}
							<div className="flex gap-3 items-center">
								<FileUploader
									folder="support-chat"
									onUploaded={(url) => setUploadedFileUrl(url)}
								/>

								<button
									onClick={handleCreateTicket}
									disabled={(!newTicketMessage.trim() && !uploadedFileUrl) || loading}
									className={`flex-1 bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
								>
									<Send className="w-5 h-5" />
									Yuborish
								</button>
							</div>
						</div>
					</>
				) : selectedTicket ? (
					<>
						<div className={`p-4 border-b-2 border-gray-100 bg-gradient-to-r ${headerGradient}`}>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<button
										onClick={() => {
											setSelectedTicket(null)
											setShowNewTicketForm(false)
										}}
										className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors"
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
									<div>
										<h2 className="font-bold text-gray-900">{`Savol #${selectedTicket.id}`}</h2>
										<p className="text-gray-400">Support (10:00 - 20:00)</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<StatusBadge status={selectedTicket.status} />
								</div>
							</div>
						</div>

						<div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-6 bg-gradient-to-br ${messagesGradient}`}>
							{messages.length === 0 ? (
								<div className="flex items-center justify-center h-full text-gray-400">
									Xabarlar topilmadi
								</div>
							) : (
								messages.map((message) =>
									editingMessage?.id === message.id ? (
										<div key={message.id} className="mb-4">
											<div className="flex justify-end">
												<div className="max-w-[70%] bg-purple-500 rounded-2xl px-3 py-2">
													<input type="text" autoFocus value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="w-full bg-white/20 text-white px-3 py-2 rounded-lg focus:outline-none mb-2" />
													<div className="flex gap-2 justify-end">
														<button onClick={() => setEditingMessage(null)} className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm">
															<X className="w-4 h-4" />
														</button>
														<button onClick={handleSaveEdit} className="px-3 py-1 bg-white text-purple-500 rounded-lg text-sm">
															<Check className="w-4 h-4" />
														</button>
													</div>
												</div>
											</div>
										</div>
									) : (
										<MessageBubble key={message.id} message={message} onEdit={handleEditMessage} onDelete={handleDeleteMessage} />
									)
								)
							)}
							{shouldShowTyping && <TypingIndicator />}
							<div ref={messagesEndRef} />
						</div>

						{selectedTicket.status !== 'CLOSED' && (
							<div className="p-4 border-t-2 border-gray-100 bg-white flex gap-3 sm:flex-row flex-col">
								{uploadedFilePreview()}
								<input
									type="text"
									placeholder={role === 'STUDENT' ? 'Xabar yozing...' : 'Javob yozing...'}
									value={replyMessage}
									onChange={(e) => {
										setReplyMessage(e.target.value)
										handleTyping(selectedTicket.id)
									}}
									onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
									className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-300 transition-colors"
								/>
								<div className="flex gap-3 items-center">
									<FileUploader folder="support-chat" onUploaded={(url) => setUploadedFileUrl(url)} />
									<button onClick={handleSendReply} disabled={loading || (!replyMessage.trim() && !uploadedFileUrl)} className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
										<Send className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<Welcome role={role} />
				)}
			</div>
		</div>
	)
}