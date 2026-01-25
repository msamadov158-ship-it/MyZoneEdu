'use client'
import { Phone } from 'lucide-react'
import { Role, Ticket } from '@/types'
import { StatusBadge } from './StatusBadge'

export const TicketCard = ({ userRole, ticket, currentUserId, onClick, isSelected, }: { userRole: Role, ticket: Ticket, currentUserId?: string | number, onClick: () => void, isSelected: boolean }) => {
    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime()

        if (diff < 0) return 'Hozirgina'

        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'Hozirgina'
        if (minutes < 60) return `${minutes} daqiqa oldin`

        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} soat oldin`

        const days = Math.floor(hours / 24)
        return `${days} kun oldin`
    }

    const hasUnread = !!ticket.last_message && ticket.last_message.is_read === false && ticket.last_message.sender_id !== currentUserId

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
                    {hasUnread && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" title="Yangi xabar" />
                    )}
                </div>
                <span className="text-xs text-gray-500">{timeAgo(ticket.last_message?.created_at || ticket.created_at)}</span>
            </div>
        </div>
    )
}