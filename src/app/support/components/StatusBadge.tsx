import { Ticket } from "@/types"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
    const config = {
        ALL: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Clock, label: 'Ochiq' },
        OPEN: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Clock, label: 'Ochiq' },
        IN_PROGRESS: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: AlertCircle, label: 'Jarayonda' },
        CLOSED: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle, label: 'Yopilgan' },
    }
    const { bg, text, icon: Icon, label } = config[status]
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    )
}