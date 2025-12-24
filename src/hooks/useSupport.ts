import { useCallback, useEffect, useState } from "react";
import { Message, Ticket } from "@/types";
import { supportService } from "@/services/supportService";
import { getUserFromStorage } from "@/lib/helpers/userStore";

export const useSupport = (userType: 'STUDENT' | 'SUPPORT') => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    const studentId = userType === 'STUDENT' ? getUserFromStorage()?.user_id as string : undefined;

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = userType === 'SUPPORT' ? await supportService.getInbox() : await supportService.getTickets();
            setTickets(data);
        } catch (err) {
            setError('Savollarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    }, [userType]);

    const fetchMessages = useCallback(async (ticketId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await supportService.getMessages(ticketId);
            setMessages(data);
        } catch (err) {
            setError('Xabarlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTicket = useCallback(async (message: string) => {
        if (userType !== 'STUDENT' || !studentId) return false;
        setLoading(true);
        setError(null);
        try {
            await supportService.createTicket(message, studentId);
            await fetchTickets();
            return true;
        } catch (err) {
            console.error('Xatolik:', err);
            setError('Savol yaratishda xatolik yuz berdi');
            return false;
        } finally {
            setLoading(false);
        }
    }, [userType, studentId, fetchTickets]);

    const sendMessage = useCallback(async (ticketId: number, message: string, overrideStudentId?: string) => {
        const idToUse = overrideStudentId ?? studentId;
        if (!idToUse) return false;
        setLoading(true);
        setError(null);
        try {
            if (userType === 'SUPPORT') {
                await supportService.sendReply(ticketId, message, idToUse);
            } else {
                await supportService.sendMessage(ticketId, message, idToUse);
            }
            await fetchMessages(ticketId);
            return true;
        } catch (err) {
            console.error('Xatolik:', err);
            setError('Xabar yuborishda xatolik yuz berdi');
            return false;
        } finally {
            setLoading(false);
        }
    }, [userType, studentId, fetchMessages]);

    const closeTicket = useCallback(async (ticketId: number) => {
        if (userType !== 'SUPPORT') return false;
        setLoading(true);
        setError(null);
        try {
            await supportService.closeTicket(ticketId);
            await fetchTickets();
            setSelectedTicket(null);
            return true;
        } catch (err) {
            setError('Savolni yopishda xatolik yuz berdi');
            return false;
        } finally {
            setLoading(false);
        }
    }, [userType, fetchTickets]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        selectedTicket,
        messages,
        error,
        setSelectedTicket,
        fetchTickets,
        fetchMessages,
        createTicket,
        sendMessage,
        closeTicket,
    };
};