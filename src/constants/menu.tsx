import { BookOpen, Home, LayoutDashboard, Users, Type, Bell, CircleQuestionMarkIcon } from 'lucide-react'

export const AdminMenu = [
	{ name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
	{ name: 'Students', href: '/admin/students', icon: <Users className="w-5 h-5" /> },
	{ name: 'Courses', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
	{ name: 'Types', href: '/admin/types', icon: <Type className="w-5 h-5" /> },
	{ name: 'Questions', href: '/admin/questions', icon: <CircleQuestionMarkIcon className="w-5 h-5" /> },
	{ name: 'Notification', href: '/admin/notification', icon: <Bell className="w-5 h-5" /> },
]

export const StudentMenu = [
	{ name: 'Home', href: '/student', icon: <Home className="w-5 h-5" /> },
	{ name: 'Notification', href: '/notification', icon: <Bell className="w-5 h-5" /> },
]
