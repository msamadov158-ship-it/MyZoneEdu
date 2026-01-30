'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FetchMessagesResponse, FetchTicketsResponse, FetchTicketsResponse2, Message, Ticket } from '@/types'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { getSocket } from '@/lib/socket'

export const useSupport = () => {
    const userType = getUserFromStorage()?.role
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unreadCount, setUnreadCount] = useState(0)

    const [typingUserId, setTypingUserId] = useState<string | null>(null)
    const [typingUserRole, setTypingUserRole] = useState<'STUDENT' | 'SUPPORT' | null>(null)

    const socketRef = useRef(getSocket())
    const currentRoomRef = useRef<number | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastTypingEmitRef = useRef(0)

    const token = getUserFromStorage()?.access_token
    const userId = getUserFromStorage()?.user_id

    const fetchTickets = useCallback(() => {
        if (!token) return
        setLoading(true)
        const socket = socketRef.current

        const eventName = userType === 'SUPPORT' ? 'get_support_inbox' : 'get_student_tickets'

        socket.emit(eventName, { token }, (res: FetchTicketsResponse) => {
            setLoading(false)
            console.log("res", res)
            if (res.status === 'ok') {
                setTickets(res.tickets)
                setUnreadCount(res.unread_count || 0)
            } else {
                setError(res.message || 'Ticketlarni olishda xatolik yuz berdi')
            }
        })
    }, [token, userType])

    const fetchMessages = useCallback(async (ticketId: number) => {
        setLoading(true)
        try {
            const socket = socketRef.current

            socket.emit('get_messages', { token, ticket_id: ticketId }, (res: FetchMessagesResponse) => {
                setLoading(false)
                if (res.status === 'ok') {
                    setMessages(res.messages)
                } else {
                    setError(res.message || 'Xabarlarni olishda xatolik')
                }
            })
        } catch {
            setLoading(false)
            setError('Xabarlarni olishda xatolik')
        }
    }, [token])

    const joinUserRoom = useCallback(() => {
        if (!token) return
        const socket = socketRef.current
        socket.emit('join_user_room', { token })
    }, [token])

    const joinTicketRoom = useCallback((ticketId: number) => {
        if (!token) return
        const socket = socketRef.current

        if (currentRoomRef.current) {
            socket.emit('leave_ticket', { ticket_id: currentRoomRef.current })
        }

        socket.emit('join_ticket', { token, ticket_id: ticketId })
        currentRoomRef.current = ticketId
    }, [token])

    const leaveTicketRoom = useCallback(() => {
        const socket = socketRef.current
        if (currentRoomRef.current) {
            socket.emit('leave_ticket', { ticket_id: currentRoomRef.current })
            currentRoomRef.current = null
        }
    }, [])

    const createTicket = useCallback((message: string, file_path?: string) => {
        const socket = socketRef.current
        if (!socket || !token) return Promise.resolve(0)

        return new Promise<number>((resolve) => {
            socket.emit(
                'create_ticket',
                { token, message, file_path },
                (res: FetchTicketsResponse2) => {
                    if (res.status === 'ok') {
                        resolve(res.ticket_id)
                    } else {
                        resolve(0)
                    }
                }
            )
        })
    }, [token])

    const sendMessage = useCallback((ticketId: number, message: string, _sid?: string, file_path?: string) => {
        const socket = socketRef.current
        if (!socket || !token) return Promise.resolve(false)

        return new Promise<boolean>((resolve) => {
            socket.emit(
                'send_message',
                { token, ticket_id: ticketId, message, file_path },
                (res: FetchTicketsResponse) => {
                    resolve(res.status === 'ok')
                }
            )
        })
    }, [token])

    const editMessage = async (messageId: number, ticketId: number, text: string) => {
        const socket = socketRef.current
        if (!socket || !token) return false

        return new Promise<boolean>((resolve) => {
            socket.emit(
                'edit_message',
                { token, message_id: messageId, message: text },
                (res: FetchTicketsResponse) => {
                    resolve(res.status === 'ok')
                }
            )
        })
    }

    const deleteMessage = async (messageId: number) => {
        const socket = socketRef.current
        if (!socket || !token) return

        socket.emit('delete_message', { token, message_id: messageId })
    }

    const closeTicket = async (ticketId: number) => {
        if (userType !== 'SUPPORT') return
        const socket = socketRef.current
        if (!socket || !token) return

        socket.emit('close_ticket', { token, ticket_id: ticketId })
    }

    const markAsRead = useCallback((ticketId: number) => {
        const socket = socketRef.current
        if (!socket || !token) return

        socket.emit('mark_as_read', { token, ticket_id: ticketId })
    }, [token])

    const handleTyping = (ticketId: number) => {
        const socket = socketRef.current
        if (!socket || !token) return

        const now = Date.now()
        if (now - lastTypingEmitRef.current > 1000) {
            socket.emit('typing', { token, ticket_id: ticketId })
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

        socket.on('message_edited', (editedMsg: Message) => {
            setMessages((prev) =>
                prev.map((msg) => (msg.id === editedMsg.id ? editedMsg : msg))
            )
        })

        socket.on('message_deleted', (data: { message_id: number }) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== data.message_id))
        })

        socket.on('ticket_closed', (data: { ticket_id: number }) => {
            setTickets((prev) =>
                prev.map((ticket) =>
                    ticket.id === data.ticket_id ? { ...ticket, status: 'CLOSED' } : ticket
                )
            )
            if (selectedTicket && selectedTicket.id === data.ticket_id) {
                setSelectedTicket({ ...selectedTicket, status: 'CLOSED' })
            }
        })

        socket.on('inbox_updated', (data: { tickets: Ticket[]; unread_count: number }) => {
            setTickets(data.tickets)
            setUnreadCount(data.unread_count)
        })

        socket.on('tickets_updated', (data: { tickets: Ticket[]; unread_count: number }) => {
            setTickets(data.tickets)
            setUnreadCount(data.unread_count)
        })

        socket.on('user_typing', (data: { user_id: string; role: 'STUDENT' | 'SUPPORT'; ticket_id: number }) => {
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
            socket.off('message_edited')
            socket.off('message_deleted')
            socket.off('ticket_closed')
            socket.off('inbox_updated')
            socket.off('tickets_updated')
            socket.off('user_typing')
            socket.off('user_stop_typing')
        }
    }, [userId, selectedTicket])

    useEffect(() => {
        joinUserRoom()
    }, [joinUserRoom])

    useEffect(() => {
        if (selectedTicket) {
            joinTicketRoom(selectedTicket.id)
            markAsRead(selectedTicket.id)
        }
        return () => leaveTicketRoom()
    }, [selectedTicket, joinTicketRoom, leaveTicketRoom, markAsRead])

    useEffect(() => {
        if (!token) return

        const socket = socketRef.current

        const eventName = userType === 'SUPPORT' ? 'support_ticket_update' : 'student_ticket_update'

        const handleUpdate = () => {
            fetchTickets()
        }

        socket.on(eventName, handleUpdate)
        Promise.resolve().then(handleUpdate)
        return () => {
            socket.off(eventName, handleUpdate)
        }
    }, [token, userType, fetchTickets])


    return {
        tickets,
        messages,
        selectedTicket,
        loading,
        error,
        unreadCount,
        typingUserId,
        typingUserRole,

        setSelectedTicket,
        fetchTickets,
        fetchMessages,
        sendMessage,
        createTicket,
        editMessage,
        deleteMessage,
        closeTicket,
        handleTyping,

        joinTicketRoom,
        leaveTicketRoom,
        markAsRead,
    }
}