import API from "@/lib/axios";
import { Message, Ticket } from "@/types";

export const supportService = {
    async getTickets(): Promise<Ticket[]> {
        const res = await API.get(`/api/support/ticket/`);
        return res.data.result;
    },

    async getInbox(): Promise<Ticket[]> {
        const res = await API.get(`/api/support/ticket/inbox`);
        return res.data.result;
    },

    async getMessages(ticketId: number): Promise<Message[]> {
        const res = await API.get(`/api/support/ticket/${ticketId}/messages`)
        return res.data.result;
    },

    async createTicket(message: string, studentId: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/`, { message, student_id: studentId });
        return res.data.result;
    },

    async sendMessage(ticketId: number, message: string, studentId: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/${ticketId}/messages`, { message, student_id: studentId });
        return res.data.result;
    },

    async sendReply(ticketId: number, message: string, studentId: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/${ticketId}/reply`, { message, student_id: studentId });
        return res.data.result;
    },

    async closeTicket(ticketId: number): Promise<void> {
        await API.post(`/api/support/ticket/${ticketId}/close`);
    },
};