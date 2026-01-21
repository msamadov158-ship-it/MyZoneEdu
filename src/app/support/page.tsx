'use client'

import { useEffect, useState } from 'react'
import { Message, Role, Ticket } from '@/types'
import { useSupport } from '@/hooks/useSupport'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { FileUploader } from '@/components/UI/SupportFileUploader'
import { AlertCircle, CheckCircle, ChevronLeft, Clock, Edit2, File, Phone, Play, Plus, Send, X, Check, Trash2 } from 'lucide-react'

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
	const config = {
		ALL: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Clock, label: 'Ochiq' },
		OPEN: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Clock, label: 'Ochiq' },
		IN_PROGRESS: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: AlertCircle, label: 'Jarayonda' },
		CLOSED: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle, label: 'Yopilgan' },
	}
	const { bg, text, icon: Icon, label } = config[status]
	return (
		<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
			<Icon className="w-3 h-3" />
			{label}
		</span>
	)
}

const TicketCard = ({ userRole, ticket, onClick, isSelected }: { userRole: Role; ticket: Ticket; onClick: () => void; isSelected: boolean }) => {
	const timeAgo = (date: string) => {
		const FIVE_HOURS = 5 * 60 * 60 * 1000
		const dateWithOffset = new Date(new Date(date).getTime() + FIVE_HOURS)
		const diff = Date.now() - dateWithOffset.getTime()
		const minutes = Math.floor(diff / 60000)
		if (minutes < 60) return `${minutes} daqiqa oldin`
		const hours = Math.floor(minutes / 60)
		if (hours < 24) return `${hours} soat oldin`
		return `${Math.floor(hours / 24)} kun oldin`
	}

	return (
		<div onClick={onClick} className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md' : 'border-gray-200 bg-white hover:border-purple-300'}`}>
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-gray-900 truncate mb-1">Savol #{ticket.id}</h3>
					{userRole === 'SUPPORT' && (
						<div className="flex flex-col items-start gap-1 text-sm text-gray-600 mt-1">
							<div className="flex items-center gap-2">
								<span className="w-3.5 h-3.5">👤</span>
								{ticket.student?.full_name}
							</div>
							<div className="flex items-center gap-2">
								<Phone className="w-3.5 h-3.5" />
								{ticket.student?.phone_number}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<StatusBadge status={ticket.status} />
				</div>
				<span className="text-xs text-gray-500">{timeAgo(ticket.updated_at || ticket.created_at)}</span>
			</div>
		</div>
	)
}

export const MessageFileRenderer = ({ file_path }: { file_path?: string }) => {
	const getFileType = (url: string) => {
		if (url?.match(/\.(png|jpg|jpeg|webp)$/i)) return 'image';
		if (url?.match(/\.(mp4|webm|ogg)$/i)) return 'video';
		return 'document';
	};

	const type = getFileType(file_path as string);

	if (type === 'image') {
		return (
			<img src={file_path} alt="image" className="rounded-xl max-h-60 cursor-pointer hover:opacity-90" onClick={() => window.open(file_path, '_blank')} />
		);
	}

	if (type === 'video') {
		return (
			<video src={file_path} controls className="rounded-xl max-h-64 w-full" />
		);
	}

	return (
		<a href={file_path} download target="_blank" className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
			<File className="w-5 h-5 text-blue-500" />
			<span className="text-sm">Faylni yuklab olish</span>
		</a>
	);
};

const MessageBubble = ({ message, onEdit, onDelete }: { message: Message; onEdit: (msg: Message) => void; onDelete: (msg: Message) => void }) => {
	const isOwn = getUserFromStorage()?.user_id === message.sender_id;

	return (
		<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
			<div className={`max-w-[70%] rounded-2xl px-3 py-2 relative ${isOwn ? 'bg-purple-500 text-white' : 'bg-white border'}`}>
				{message.message && (
					<p className="text-sm mb-2">{message.message}</p>
				)}
				{message.file_path && <MessageFileRenderer file_path={message.file_path} />}

				{isOwn && (
					<div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
						<button
							onClick={() => onEdit(message)}
							className="p-1.5 rounded-lg hover:bg-gray-100"
						>
							<Edit2 className="w-4 h-4 text-gray-500" />
						</button>
						<button
							onClick={() => onDelete(message)}
							className="p-1.5 rounded-lg hover:bg-red-50"
						>
							<Trash2 className="w-4 h-4 text-red-500" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default function SupportPage() {
	const [user, setUser] = useState<ReturnType<typeof getUserFromStorage> | null>(null)

	useEffect(() => {
		setUser(getUserFromStorage())
	}, [])

	const role = user?.role || 'STUDENT'
	const userType: 'STUDENT' | 'SUPPORT' = role === 'STUDENT' ? 'STUDENT' : 'SUPPORT'
	const support = useSupport(userType)
	const [replyMessage, setReplyMessage] = useState('')
	const [showNewTicketForm, setShowNewTicketForm] = useState(false)
	const [newTicketMessage, setNewTicketMessage] = useState('')
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
	const [editingMessage, setEditingMessage] = useState<Message | null>(null);
	const [editMessageText, setEditMessageText] = useState('');

	const { tickets, loading, selectedTicket, messages, setSelectedTicket, fetchMessages, createTicket, sendMessage, closeTicket, editMessage, deleteMessage } = support

	const primaryColor = role === 'STUDENT' ? 'purple' : 'indigo'
	const spinnerBorder = `border-${primaryColor}-500`
	const buttonGradient = role === 'STUDENT' ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500'
	const headerGradient = role === 'STUDENT' ? 'from-purple-50 to-pink-50' : 'from-indigo-50 to-purple-50'
	const messagesGradient = `from-gray-50 to-${primaryColor}-50/30`

	// Ticketlarni eng oxirgi message created_at bo'yicha saralash
	const sortedTickets = [...tickets].sort((a, b) => {
		// Har bir ticketning eng oxirgi message vaqtini topish
		const getLastMessageTime = (ticketId: number) => {
			const ticketMessages = messages.filter(m => m.ticket_id === ticketId);
			if (ticketMessages.length === 0) return new Date(a.created_at).getTime();
			const lastMsg = ticketMessages[ticketMessages.length - 1];
			return new Date(lastMsg.created_at).getTime();
		};

		// Agar selectedTicket bo'lsa, uning messagelaridan foydalanish
		// Aks holda ticket'ning o'zidagi updated_at yoki created_at
		const timeA = a.updated_at ? new Date(a.updated_at).getTime() : new Date(a.created_at).getTime();
		const timeB = b.updated_at ? new Date(b.updated_at).getTime() : new Date(b.created_at).getTime();

		return timeB - timeA; // Eng yangi birinchi
	});

	const handleSendReply = async () => {
		if ((!replyMessage.trim() && !uploadedFileUrl) || !selectedTicket) return

		const studentIdToUse = role === 'STUDENT' ? undefined : selectedTicket.student_id
		const success = await sendMessage(selectedTicket.id, replyMessage, studentIdToUse, uploadedFileUrl || undefined)
		if (success) {
			setReplyMessage('')
			setUploadedFileUrl(null);
		}
	};

	const handleCreateTicket = async () => {
		if (!newTicketMessage.trim() && !uploadedFileUrl) return
		const ticketId = await createTicket(newTicketMessage, uploadedFileUrl || undefined)
		if (ticketId) {
			setNewTicketMessage('')
			setUploadedFileUrl(null)
			setShowNewTicketForm(false)

			// Yangi yaratilgan ticketni tanlash
			const newTicket = tickets.find(t => t.id === ticketId)
			if (newTicket) {
				setSelectedTicket(newTicket)
				await fetchMessages(ticketId)
			}
		}
	}

	const handleSelectTicket = async (ticket: Ticket) => {
		setSelectedTicket(ticket)
		await fetchMessages(ticket.id)
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
		if (!selectedTicket) return;
		if (!confirm('Xabarni o\'chirmoqchimisiz?')) return;

		await deleteMessage(msg.id, selectedTicket.id);
	};

	const getFileTypeFromUrl = (url: string) => {
		if (url.match(/\.(png|jpg|jpeg|webp)$/i)) return 'image';
		if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
		return 'document';
	};

	const uploadedFilePreview = () => {
		if (!uploadedFileUrl) return
		const type = getFileTypeFromUrl(uploadedFileUrl);

		return (
			<div className="relative w-20 h-20 mb-3 rounded-xl bg-gray-50">
				<button onClick={() => setUploadedFileUrl(null)} className="absolute -top-2 -right-2 z-100 bg-white rounded-full p-1 shadow cursor-pointer">
					<X className="w-4 h-4 text-gray-600" />
				</button>

				{type === 'image' && (
					<img src={uploadedFileUrl} alt="preview" className="w-full h-full object-cover rounded-xl" />
				)}

				{type === 'video' && (
					<div className="w-full h-full relative flex items-center justify-center bg-black rounded-xl overflow-hidden">
						<video src={uploadedFileUrl} className="w-full h-full object-cover" muted />
						<Play className="absolute w-6 h-6 text-white opacity-80" />
					</div>
				)}

				{type === 'document' && (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
						<File className="w-6 h-6" />
						<span className="text-[10px] mt-1 text-center">Fayl</span>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-full">
			<div className="lg:col-span-1 bg-white rounded-2xl shadow-xl min-h-[400px] h-full overflow-hidden flex flex-col">
				<div className="p-4 border-b-2 border-gray-100">
					{role === 'STUDENT' && (
						<button onClick={() => setShowNewTicketForm(true)} className={`w-full bg-gradient-to-r ${buttonGradient} text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2`}>
							<Plus className="w-5 h-5" />
							Yangi Savol yaratish
						</button>
					)}
				</div>
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{loading && tickets.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className={`animate-spin rounded-full h-8 w-8 border-4 ${spinnerBorder} border-t-transparent`}></div>
						</div>
					) : sortedTickets.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-400">
							<span className="text-4xl mb-3">💬</span>
							<p className="text-sm">Savollar topilmadi</p>
						</div>
					) : (
						sortedTickets.map((ticket) => <TicketCard key={ticket.id} userRole={role} ticket={ticket} onClick={() => handleSelectTicket(ticket)} isSelected={selectedTicket?.id === ticket.id} />)
					)}
				</div>
			</div>

			<div className="lg:col-span-2 bg-white rounded-2xl shadow-xl min-h-[400px] h-full overflow-auto flex flex-col">
				{role === 'STUDENT' && showNewTicketForm ? (
					<>
						<div className={`p-4 border-b-2 border-gray-100 bg-gradient-to-r ${headerGradient}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<button onClick={() => setShowNewTicketForm(false)} className="p-2 hover:bg-white rounded-lg transition-colors">
										<ChevronLeft className="w-5 h-5" />
									</button>
									<h2 className="font-bold text-gray-900">Yangi Savol</h2>
								</div>
							</div>
						</div>
						<div className={`flex-1 p-6 bg-gradient-to-br ${messagesGradient}`}>
							<textarea placeholder="Savol matnini yozing..." value={newTicketMessage} onChange={(e) => setNewTicketMessage(e.target.value)} className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors resize-none" />
						</div>

						<div className="p-4 border-t-2 border-gray-100 bg-white">
							{uploadedFilePreview()}
							<div className="flex gap-3 items-center">
								<FileUploader folder="support-chat" onUploaded={(url) => setUploadedFileUrl(url)} />
								<button onClick={handleCreateTicket} disabled={(!newTicketMessage.trim() && !uploadedFileUrl) || loading} className={`flex-1 bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
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
									<button onClick={() => setSelectedTicket(null)} className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors">
										<ChevronLeft className="w-5 h-5" />
									</button>
									<div>
										<h2 className="font-bold text-gray-900">{`Savol #${selectedTicket.id}`}</h2>
										<p className="text-gray-400">Support (10:00 - 20:00)</p>
										{role === 'SUPPORT' && (
											<div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
												<div className="flex items-center gap-2">
													<span>👤</span>
													{selectedTicket.student?.full_name}
												</div>
												<div className="flex items-center gap-2">
													<Phone className="w-3.5 h-3.5" />
													{selectedTicket.student?.phone_number}
												</div>
											</div>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2">
									<StatusBadge status={selectedTicket.status} />
								</div>
							</div>
							{role === 'SUPPORT' && selectedTicket.status !== 'CLOSED' && (
								<div className="flex gap-2">
									<button onClick={() => closeTicket(selectedTicket.id)} className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
										<CheckCircle className="w-4 h-4" />
										Yopish
									</button>
								</div>
							)}
						</div>

						<div className={`flex-1 overflow-y-auto p-6 bg-gradient-to-br ${messagesGradient}`}>
							{loading && messages.length === 0 ? (
								<div className="flex items-center justify-center h-full">
									<div className={`animate-spin rounded-full h-8 w-8 border-4 ${spinnerBorder} border-t-transparent`}></div>
								</div>
							) : messages.length === 0 ? (
								<div className="flex items-center justify-center h-full text-gray-400">
									<p>Xabarlar topilmadi</p>
								</div>
							) : (
								messages.map((message) => (
									editingMessage?.id === message.id ? (
										<div key={message.id} className="mb-4">
											<div className="flex justify-end">
												<div className="max-w-[70%] bg-purple-500 rounded-2xl px-3 py-2">
													<input
														type="text"
														value={editMessageText}
														onChange={(e) => setEditMessageText(e.target.value)}
														className="w-full bg-white/20 text-white px-3 py-2 rounded-lg focus:outline-none mb-2"
														autoFocus
													/>
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
								))
							)}
						</div>

						{selectedTicket.status !== 'CLOSED' && (
							<div className="p-4 border-t-2 border-gray-100 bg-white">
								{uploadedFilePreview()}
								<div className="flex gap-3 sm:items-center flex-col sm:flex-row">
									<input type="text" placeholder={role === 'STUDENT' ? 'Xabar yozing...' : 'Javob yozing...'} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />

									<div className='flex gap-3 items-center'>
										<FileUploader folder="support-chat" onUploaded={(url) => setUploadedFileUrl(url)} />

										<button onClick={handleSendReply} disabled={loading || (!replyMessage.trim() && !uploadedFileUrl)} className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all disabled:opacity-50`}>
											<Send className="w-5 h-5" />
										</button>
									</div>

								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-gray-400">
						<div className="text-center">
							<span className="text-6xl mb-4 block">💬</span>
							<p className="text-lg font-medium">Savolni tanlang</p>
							<p className="text-sm mt-1">{role === 'STUDENT' ? 'Suhbatni boshlash uchun chap tarafdan Savol tanlang' : 'Javob berish uchun chap tarafdan Savol tanlang'}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}