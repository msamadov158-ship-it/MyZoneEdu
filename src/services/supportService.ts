import API from "@/lib/axios";
import { Message, Ticket } from "@/types";

export const supportService = {
    async getTickets(): Promise<Ticket[]> {
        const res = await API.get(`/api/support/ticket/`);
        return res.data.result.tickets;
    },

    async getInbox(): Promise<Ticket[]> {
        const res = await API.get(`/api/support/ticket/inbox`);
        return res.data.result.tickets;
    },

    async getMessages(ticketId: number): Promise<Message[]> {
        const res = await API.get(`/api/support/ticket/${ticketId}/messages`)
        return res.data.result;
    },

    async createTicket(message: string, studentId: string, file_path?: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/`, { message, student_id: studentId, file_path });
        return res.data.result;
    },

    async sendMessage(ticketId: number, message: string, studentId: string, file_path?: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/${ticketId}/messages`, { message, file_path, student_id: studentId });
        return res.data.result;
    },

    async sendReply(ticketId: number, message: string, studentId: string, file_path?: string): Promise<number> {
        const res = await API.post(`/api/support/ticket/${ticketId}/reply`, { message, file_path, student_id: studentId });
        return res.data.result;
    },

    async editMessage(messageId: number, message: string): Promise<void> {
        await API.patch(`/api/support/ticket/message/${messageId}`, { message });
    },

    async deleteMessage(messageId: number): Promise<void> {
        await API.delete(`/api/support/ticket/message/${messageId}`);
    },

    async closeTicket(ticketId: number): Promise<void> {
        await API.post(`/api/support/ticket/${ticketId}/close`);
    },
};