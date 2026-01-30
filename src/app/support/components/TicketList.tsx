import { Role, Ticket } from '@/types'
import { TicketCard } from './TicketCard'

interface TicketListProps {
    userRole: Role
    tickets: Ticket[]
    currentUserId?: string
    selectedTicket: Ticket | null
    onSelectTicket: (ticket: Ticket) => void
    loading: boolean
}

export const TicketList = ({ userRole, tickets, currentUserId, selectedTicket, onSelectTicket, loading }: TicketListProps) => {
    const ticketsToShow = userRole === 'STUDENT' ? tickets.slice(0, 1) : tickets

    if (loading && tickets.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
        )
    }

    if (ticketsToShow.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-4xl mb-3">💬</span>
                <p className="text-sm">Savollar topilmadi</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {ticketsToShow.map((ticket) => (
                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    userRole={userRole}
                    currentUserId={currentUserId}
                    onClick={() => onSelectTicket(ticket)}
                    isSelected={selectedTicket?.id === ticket.id}
                />
            ))}
        </div>
    )
}
