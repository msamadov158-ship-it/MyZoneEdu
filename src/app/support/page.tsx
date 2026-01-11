'use client'

import { useEffect, useState } from 'react'
import { Message, Role, Ticket } from '@/types'
import { useSupport } from '@/hooks/useSupport'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { FileUploader } from '@/components/UI/SupportFileUploader'
import { AlertCircle, CheckCircle, ChevronLeft, Clock, File, FileIcon, Loader2, MessageCircle, Phone, Play, Plus, Send, UploadIcon, User, X } from 'lucide-react'

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
								<User className="w-3.5 h-3.5" />
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
				<span className="text-xs text-gray-500">{timeAgo(ticket.created_at)}</span>
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

const MessageBubble = ({ message }: { message: Message }) => {
	const isOwn = getUserFromStorage()?.user_id === message.sender_id;

	console.log("message.file_path", message.file_path)
	return (
		<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
			<div className={`max-w-[70%] rounded-2xl px-3 py-2 ${isOwn ? 'bg-purple-500 text-white' : 'bg-white border'}`}>

				{message.message && (
					<p className="text-sm mb-2">{message.message}</p>
				)}
				{message.file_path && <MessageFileRenderer file_path={message.file_path} />}

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
	const [filterStatus, setFilterStatus] = useState<'ALL' | Ticket['status']>('ALL')
	const [showNewTicketForm, setShowNewTicketForm] = useState(false)
	const [newTicketMessage, setNewTicketMessage] = useState('')
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);


	const { tickets, loading, selectedTicket, messages, setSelectedTicket, fetchTickets, fetchMessages, createTicket, sendMessage, closeTicket } = support

	const primaryColor = role === 'STUDENT' ? 'purple' : 'indigo'
	const spinnerBorder = `border-${primaryColor}-500`
	const buttonGradient = role === 'STUDENT' ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500'
	const headerGradient = role === 'STUDENT' ? 'from-purple-50 to-pink-50' : 'from-indigo-50 to-purple-50'
	const messagesGradient = `from-gray-50 to-${primaryColor}-50/30`

	const filteredTickets = tickets.filter((ticket) => {
		const matchesFilter = filterStatus === 'ALL' || ticket.status === filterStatus
		return matchesFilter
	})

	const handleSendReply = async () => {
		if (!replyMessage.trim() || !selectedTicket) return

		const studentIdToUse = role === 'STUDENT' ? undefined : selectedTicket.student_id
		const success = await sendMessage(selectedTicket.id, replyMessage, studentIdToUse, uploadedFileUrl || undefined)
		if (success) {
			setReplyMessage('')
		}

		setReplyMessage('');
		setUploadedFileUrl(null);
	};



	const handleCreateTicket = async () => {
		if (!newTicketMessage.trim()) return
		await createTicket(newTicketMessage)
		setNewTicketMessage('')
		setShowNewTicketForm(false)
		await fetchTickets()
	}

	const handleSelectTicket = async (ticket: Ticket) => {
		setSelectedTicket(ticket)
		await fetchMessages(ticket.id)
	}

	const getFileTypeFromUrl = (url: string) => {
		if (url.match(/\.(png|jpg|jpeg|webp)$/i)) return 'image';
		if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
		return 'document';
	};

	const uploadedFilePreview = () => {
		if (!uploadedFileUrl) return
		const type = getFileTypeFromUrl(uploadedFileUrl);

		return (
			<div className="relative w-20 h-20 mb-3 rounded-xl  bg-gray-50">
				<button onClick={() => setUploadedFileUrl(null)} className="absolute -top-2 -right-2 z-100 bg-white rounded-full p-1 shadow cursor-pointer">
					<X className="w-4 h-4 text-gray-600" />
				</button>

				{type === 'image' && (
					<img src={uploadedFileUrl} alt="preview" className="w-full h-full object-cover" />
				)}

				{type === 'video' && (
					<div className="w-full h-full relative flex items-center justify-center bg-black">
						<video src={uploadedFileUrl} className="w-full h-full object-cover" muted />
						<Play className="absolute w-6 h-6 text-white opacity-80" />
					</div>
				)}

				{type === 'document' && (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
						<FileIcon className="w-6 h-6" />
						<span className="text-[10px] mt-1 text-center">
							Fayl
						</span>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-full">
			<div className="lg:col-span-1 bg-white rounded-2xl shadow-xl min-h-[400px] h-full overflow-hidden flex flex-col">
				<div className="p-4 border-b-2 border-gray-100">
					{/* <div className="relative mb-3">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input type="text" placeholder="Qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl ${focusBorder} focus:outline-none transition-colors`} />
					</div> */}
					<div className="flex gap-2">
						{(['ALL', 'OPEN', 'CLOSED'] as const).map((status) => (
							<button key={status} onClick={() => setFilterStatus(status)} className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === status ? `bg-myZoneOnline text-white shadow-md` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
								{status === 'ALL' ? 'Hammasi' : status === 'OPEN' ? 'Ochiq' : 'Yopilgan'}
							</button>
						))}
					</div>
					{role === 'STUDENT' && (
						<button onClick={() => setShowNewTicketForm(true)} className={`w-full bg-gradient-to-r ${buttonGradient} text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mt-3`}>
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
					) : filteredTickets.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-400">
							<MessageCircle className="w-12 h-12 mb-3 opacity-50" />
							<p className="text-sm">Savollar topilmadi</p>
						</div>
					) : (
						filteredTickets.map((ticket) => <TicketCard key={ticket.id} userRole={role} ticket={ticket} onClick={() => handleSelectTicket(ticket)} isSelected={selectedTicket?.id === ticket.id} />)
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
							<textarea placeholder="Savol matnini yozing..." value={newTicketMessage} onChange={(e) => setNewTicketMessage(e.target.value)} className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl ${focusBorder} focus:outline-none transition-colors resize-none" />
						</div>
						<div className="p-4 border-t-2 border-gray-100 bg-white">
							<button onClick={handleCreateTicket} disabled={!newTicketMessage.trim() || loading} className={`w-full bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 `}>
								<Send className="w-5 h-5" />
								Yaratish
							</button>
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
													<User className="w-3.5 h-3.5" />
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
								messages.map((message) => <MessageBubble key={message.id} message={message} />)
							)}
						</div>
						{selectedTicket.status !== 'CLOSED' && (
							<div className="p-4 border-t-2 border-gray-100 bg-white">
								{uploadedFilePreview()}
								<div className="flex gap-3 items-center">
									<input type="text" placeholder={role === 'STUDENT' ? 'Xabar yozing...' : 'Javob yozing...'} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />

									<FileUploader folder="support-chat" onUploaded={(url) => setUploadedFileUrl(url)} />

									<button onClick={handleSendReply} disabled={loading || (!replyMessage.trim() && !uploadedFileUrl)} className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all disabled:opacity-50`}>
										<Send className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}

					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-gray-400">
						<div className="text-center">
							<MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
							<p className="text-lg font-medium">Savolni tanlang</p>
							<p className="text-sm mt-1">{role === 'STUDENT' ? 'Suhbatni boshlash uchun chap tarafdan Savol tanlang' : 'Javob berish uchun chap tarafdan Savol tanlang'}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
