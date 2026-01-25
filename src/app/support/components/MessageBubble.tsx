import { Edit2, Trash2 } from "lucide-react";
import { Message } from "@/types";
import { MessageFileRenderer } from "./MessageFileRenderer";
import { getUserFromStorage } from "@/lib/helpers/userStore";

export const MessageBubble = ({ message, onEdit, onDelete }: { message: Message; onEdit: (msg: Message) => void; onDelete: (msg: Message) => void }) => {
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
						<button	onClick={() => onEdit(message)}	className="p-1.5 rounded-lg hover:bg-gray-100">
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