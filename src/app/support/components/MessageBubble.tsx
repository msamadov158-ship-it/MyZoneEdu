import { Edit2, Trash2 } from "lucide-react";
import { Message } from "@/types";
import { MessageFileRenderer } from "./MessageFileRenderer";
import { getUserFromStorage } from "@/lib/helpers/userStore";

export const MessageBubble = ({
	message,
	onEdit,
	onDelete,
}: {
	message: Message;
	onEdit: (msg: Message) => void;
	onDelete: (msg: Message) => void;
}) => {
	const isOwn = getUserFromStorage()?.user_id === message.sender_id;
	const time = new Date(message.created_at).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end mb-4 group`}>
			{!isOwn && (
				<div className="hidden md:flex items-end">
					<div className="w-10 h-10 flex justify-center bg-red-200 rounded-full items-center mr-2 text-red-500 translate-y-2 font-semibold">
						S
					</div>
				</div>
			)}

			<div className="flex flex-col max-w-[75%] sm:max-w-md">
				<div
					className={`rounded-xl px-3 py-2 relative ${
						isOwn
							? "bg-white text-gray-900 border border-gray-400 rounded-tr-none self-end"
							: "bg-red-100 text-gray-900 rounded-tl-none"
					}`}
				>
					{message.message && (
						<p className="text-sm wrap-break-word whitespace-pre-wrap">{message.message}</p>
					)}
					{message.file_path && <MessageFileRenderer file_path={message.file_path} />}

					{isOwn && (
						<div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 whitespace-nowrap">
							<button
								onClick={() => onEdit(message)}
								className="p-1.5 rounded-lg hover:bg-gray-100"
							>
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

				<p className={`mt-1 text-xs text-gray-500 ${isOwn ? "text-right" : "text-left"}`}>
					{time}
				</p>
			</div>
		</div>
	);
};