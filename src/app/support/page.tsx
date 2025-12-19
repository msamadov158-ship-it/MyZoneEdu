'use client'

import { useState } from 'react'
import { Message, Ticket } from '@/types'
import { useSupport } from '@/hooks/useSupport'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { AlertCircle, CheckCircle, ChevronLeft, Clock, MessageCircle, Plus, Send, User } from 'lucide-react'

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

const PriorityBadge = ({ priority }: { priority?: Ticket['priority'] }) => {
	if (!priority) return null
	const config = {
		LOW: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Past' },
		MEDIUM: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: "O'rta" },
		HIGH: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Yuqori' },
	}
	const { bg, text, label } = config[priority]
	return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>
}

const TicketCard = ({ ticket, onClick, isSelected }: { ticket: Ticket; onClick: () => void; isSelected: boolean }) => {
	const timeAgo = (date: string) => {
		const diff = Date.now() - new Date(date).getTime()
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
					<h3 className="font-semibold text-gray-900 truncate mb-1">{ticket.subject || `Ariza #${ticket.id}`}</h3>
					<p className="text-sm text-gray-600 flex items-center gap-2">
						<User className="w-3.5 h-3.5" />
						{ticket.student_name || `Student #${ticket.student_id}`}
					</p>
				</div>
				{ticket.unread_count && ticket.unread_count > 0 && <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{ticket.unread_count}</span>}
			</div>
			{ticket.last_message && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.last_message}</p>}
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<StatusBadge status={ticket.status} />
					<PriorityBadge priority={ticket.priority} />
				</div>
				<span className="text-xs text-gray-500">{timeAgo(ticket.created_at)}</span>
			</div>
		</div>
	)
}

const MessageBubble = ({ message }: { message: Message }) => {
	const isOwn = getUserFromStorage()?.user_id === message.sender_id
	const formatTime = (date: string) => {
		return new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
	}
	return (
		<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-in slide-in-from-bottom-3 duration-300`}>
			<div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
				<div className={`px-4 py-3 rounded-2xl shadow-sm ${isOwn ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-md' : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-md'}`}>
					<p className="text-sm leading-relaxed">{message.message}</p>
					<p className={`text-xs mt-2 ${isOwn ? 'text-purple-100' : 'text-gray-500'}`}>{formatTime(message.created_at)}</p>
				</div>
			</div>
		</div>
	)
}

export default function SupportPage() {
	const user = getUserFromStorage()
	const role = user?.role || 'STUDENT'
	const userType: 'STUDENT' | 'SUPPORT' = role === 'STUDENT' ? 'STUDENT' : 'SUPPORT'
	const support = useSupport(userType)
	const [replyMessage, setReplyMessage] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [filterStatus, setFilterStatus] = useState<'ALL' | Ticket['status']>('ALL')
	const [showNewTicketForm, setShowNewTicketForm] = useState(false)
	const [newTicketMessage, setNewTicketMessage] = useState('')

	const { tickets, loading, selectedTicket, messages, setSelectedTicket, fetchTickets, fetchMessages, createTicket, sendMessage, closeTicket } = support

	const primaryColor = role === 'STUDENT' ? 'purple' : 'indigo'
	const borderColor = `border-${primaryColor}-100`
	const focusBorder = `focus:border-${primaryColor}-400`
	const spinnerBorder = `border-${primaryColor}-500`
	const buttonGradient = role === 'STUDENT' ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500'
	const headerGradient = role === 'STUDENT' ? 'from-purple-50 to-pink-50' : 'from-indigo-50 to-purple-50'
	const messagesGradient = `from-gray-50 to-${primaryColor}-50/30`

	const filteredTickets = tickets.filter((ticket) => {
		const matchesSearch = (ticket.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (role === 'STUDENT' ? (ticket.last_message?.toLowerCase() || '').includes(searchQuery.toLowerCase()) : (ticket.student_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
		const matchesFilter = filterStatus === 'ALL' || ticket.status === filterStatus
		return matchesSearch && matchesFilter
	})

	const stats = {
		total: tickets.length,
		open: tickets.filter((t) => t.status === 'OPEN').length,
		inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
		closed: tickets.filter((t) => t.status === 'CLOSED').length,
	}

	const handleSendReply = async () => {
		if (!replyMessage.trim() || !selectedTicket) return
		const studentIdToUse = role === 'STUDENT' ? undefined : selectedTicket.student_id
		const success = await sendMessage(selectedTicket.id, replyMessage, studentIdToUse)
		if (success) {
			setReplyMessage('')
		}
	}

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

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-full">
			<div className={`lg:col-span-1 bg-white rounded-2xl shadow-xl border-2 min-h-[400px] h-full ${borderColor} overflow-hidden flex flex-col`}>
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
						<button onClick={() => setShowNewTicketForm(true)} className={`w-full bg-gradient-to-r ${buttonGradient} text-white px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 mt-3`}>
							<Plus className="w-5 h-5" />
							Yangi ariza yaratish
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
							<p className="text-sm">Arizalar topilmadi</p>
						</div>
					) : (
						filteredTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} onClick={() => handleSelectTicket(ticket)} isSelected={selectedTicket?.id === ticket.id} />)
					)}
				</div>
			</div>
			<div className={`lg:col-span-2 bg-white rounded-2xl shadow-xl border-2 min-h-[400px] h-full ${borderColor} overflow-auto flex flex-col `}>
				{role === 'STUDENT' && showNewTicketForm ? (
					<>
						<div className={`p-4 border-b-2 border-gray-100 bg-gradient-to-r ${headerGradient}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<button onClick={() => setShowNewTicketForm(false)} className="p-2 hover:bg-white rounded-lg transition-colors">
										<ChevronLeft className="w-5 h-5" />
									</button>
									<h2 className="font-bold text-gray-900">Yangi ariza</h2>
								</div>
							</div>
						</div>
						<div className={`flex-1 p-6 bg-gradient-to-br ${messagesGradient}`}>
							<textarea placeholder="Ariza matnini yozing..." value={newTicketMessage} onChange={(e) => setNewTicketMessage(e.target.value)} className={`w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl ${focusBorder} focus:outline-none transition-colors resize-none`} />
						</div>
						<div className="p-4 border-t-2 border-gray-100 bg-white">
							<button onClick={handleCreateTicket} disabled={!newTicketMessage.trim() || loading} className={`w-full bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105`}>
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
										<h2 className="font-bold text-gray-900">{selectedTicket.subject || `Ariza #${selectedTicket.id}`}</h2>
										<p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
											<User className="w-3.5 h-3.5" />
											{selectedTicket.student_name || `Student #${selectedTicket.student_id}`}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<StatusBadge status={selectedTicket.status} />
									<PriorityBadge priority={selectedTicket.priority} />
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
								<div className="flex gap-3">
									<input type="text" placeholder={role === 'STUDENT' ? 'Xabar yozing...' : 'Javob yozing...'} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendReply()} className={`flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl ${focusBorder} focus:outline-none transition-colors`} />
									<button onClick={handleSendReply} disabled={!replyMessage.trim() || loading} className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105`}>
										<Send className="w-5 h-5" />
										Yuborish
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-gray-400">
						<div className="text-center">
							<MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
							<p className="text-lg font-medium">Arizani tanlang</p>
							<p className="text-sm mt-1">{role === 'STUDENT' ? 'Suhbatni boshlash uchun chap tarafdan ariza tanlang' : 'Javob berish uchun chap tarafdan ariza tanlang'}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

{
	/* {role === 'SUPPORT' && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{[
						{ label: 'Jami', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: MessageCircle },
						{ label: 'Ochiq', value: stats.open, color: 'from-yellow-500 to-orange-500', icon: Clock },
						{ label: 'Jarayonda', value: stats.inProgress, color: 'from-purple-500 to-pink-500', icon: AlertCircle },
						{ label: 'Yopilgan', value: stats.closed, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
					].map((stat, i) => (
						<div key={i} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
							<div className={`bg-gradient-to-r ${stat.color} p-2 rounded-xl w-fit mb-3`}>
								<stat.icon className="w-5 h-5 text-white" />
							</div>
							<p className="text-2xl font-bold text-gray-900">{stat.value}</p>
							<p className="text-sm text-gray-600">{stat.label}</p>
						</div>
					))}
				</div>
			)} */
}
