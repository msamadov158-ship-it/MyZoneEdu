import { Role } from "@/types";

export const Welcome = ({ role }: { role: Role }) => {
    const msg = role === 'STUDENT' ? 'Suhbatni boshlash uchun chap tarafdan Savol tanlang' : 'Javob berish uchun chap tarafdan Savol tanlang'
    return (
        <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p className="text-lg font-medium">Savolni tanlang</p>
                <p className="text-sm mt-1">{msg || ''}</p>
            </div>
        </div>
    )
}