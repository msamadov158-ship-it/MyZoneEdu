'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Message, Ticket } from '@/types'
import { supportService } from '@/services/supportService'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { getSocket } from '@/lib/socket'

export const useSupport = () => {
    const userType = getUserFromStorage()?.role
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [typingUserId, setTypingUserId] = useState<string | null>(null)
    const [typingUserRole, setTypingUserRole] = useState<'STUDENT' | 'SUPPORT' | null>(null)

    const socketRef = useRef(getSocket())
    const currentRoomRef = useRef<number | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastTypingEmitRef = useRef(0)

    const token = getUserFromStorage()?.access_token
    const userId = getUserFromStorage()?.user_id

    const fetchTickets = useCallback(async () => {
        setLoading(true)
        try {
            const data = userType === 'SUPPORT' ? await supportService.getInbox() : await supportService.getTickets()
            setTickets(data)
        } finally {
            setLoading(false)
        }
    }, [userType])

    const fetchMessages = useCallback(async (ticketId: number) => {
        setLoading(true)
        try {
            const data = await supportService.getMessages(ticketId)
            setMessages(data)
        } finally {
            setLoading(false)
        }
    }, [])

    const joinTicketRoom = useCallback(
        (ticketId: number) => {
            if (!token) return
            const socket = socketRef.current

            if (currentRoomRef.current) {
                socket.emit('leave_ticket', {
                    ticket_id: currentRoomRef.current,
                })
            }

            socket.emit('join_ticket', { token, ticket_id: ticketId })
            currentRoomRef.current = ticketId
        },
        [token]
    )

    const leaveTicketRoom = useCallback(() => {
        const socket = socketRef.current
        if (currentRoomRef.current) {
            socket.emit('leave_ticket', {
                ticket_id: currentRoomRef.current,
            })
            currentRoomRef.current = null
        }
    }, [])

    const sendMessage = useCallback(
        (ticketId: number, message: string, _sid?: string, file_path?: string) => {
            const socket = socketRef.current
            if (!socket || !token) return Promise.resolve(false)

            return new Promise<boolean>((resolve) => {
                socket.emit(
                    'send_message',
                    { token, ticket_id: ticketId, message, file_path },
                    () => resolve(true)
                )
            })
        },
        [token]
    )

    const createTicket = async (message: string, file_path?: string) => {
        const id = await supportService.createTicket(
            message,
            userId as string,
            file_path
        )
        await fetchTickets()
        return id
    }

    const editMessage = async (messageId: number, ticketId: number, text: string) => {
        await supportService.editMessage(messageId, text)
        await fetchMessages(ticketId)
        return true
    }

    const deleteMessage = async (messageId: number, ticketId: number) => {
        await supportService.deleteMessage(messageId)
        await fetchMessages(ticketId)
        await fetchTickets()
    }

    const closeTicket = async (ticketId: number) => {
        if (userType !== 'SUPPORT') return
        socketRef.current.emit('close_ticket', { token, ticket_id: ticketId })
        await fetchTickets()
    }

    const markAsRead = (ticketId: number) => {
        socketRef.current.emit('mark_as_read', { token, ticket_id: ticketId })
    }

    const handleTyping = (ticketId: number) => {
        const socket = socketRef.current
        if (!socket || !token) return

        const now = Date.now()
        if (now - lastTypingEmitRef.current > 1000) {
            socket.emit('typing', {
                token,
                ticket_id: ticketId,
            })
            lastTypingEmitRef.current = now
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { token, ticket_id: ticketId })
        }, 1200)
    }

    useEffect(() => {
        const socket = socketRef.current

        socket.on('new_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })

        socket.on('user_typing', (data: { user_id: string, role: 'STUDENT' | 'SUPPORT', ticket_id: number }) => {
            if (data.user_id !== userId) {
                setTypingUserId(data.user_id)
                setTypingUserRole(data.role)
            }
        })

        socket.on('user_stop_typing', () => {
            setTypingUserId(null)
            setTypingUserRole(null)
        })

        return () => {
            socket.off('new_message')
            socket.off('user_typing')
            socket.off('user_stop_typing')
        }
    }, [userId])

    useEffect(() => {
        if (selectedTicket) {
            joinTicketRoom(selectedTicket.id)
            markAsRead(selectedTicket.id)
        }
        return () => leaveTicketRoom()
    }, [selectedTicket])

    useEffect(() => {
        fetchTickets()
    }, [])

    return {
        tickets,
        messages,
        selectedTicket,
        loading,
        error,
        typingUserId,
        typingUserRole,

        setSelectedTicket,
        fetchMessages,
        sendMessage,
        createTicket,
        editMessage,
        deleteMessage,
        closeTicket,
        handleTyping,

        // 👇 QO‘SHILADI
        joinTicketRoom,
        leaveTicketRoom,
        markAsRead,
    }
}
