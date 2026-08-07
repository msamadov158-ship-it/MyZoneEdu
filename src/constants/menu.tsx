import {ChartNoAxesCombined,BookOpen, Home, LayoutDashboard, Users, Type, Bell, CircleQuestionMarkIcon, Headset, Award, BookCheck, Newspaper, BookOpenCheck } from 'lucide-react'

export const AdminMenu = [
	{ name: 'Boshqaruv paneli', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
	{ name: 'Talabalar', href: '/admin/students', icon: <Users className="w-5 h-5" /> },
	{ name: 'Kurslar', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
	{ name: 'Analitika', href: '/admin/analytics', icon: <ChartNoAxesCombined className="w-5 h-5" /> },
	{ name: 'Turlar', href: '/admin/types', icon: <Type className="w-5 h-5" /> },
	{ name: 'Savollar', href: '/admin/questions', icon: <CircleQuestionMarkIcon className="w-5 h-5" /> },
	{ name: 'Module Savollar', href: '/admin/module', icon: <CircleQuestionMarkIcon className="w-5 h-5" /> },
    { name: 'Yangiliklar', href: '/admin/news', icon: <Newspaper className="w-5 h-5" /> },
	{ name: 'Bildirishnomalar', href: '/admin/notification', icon: <Bell className="w-5 h-5" /> },
]

export const StudentMenu = [
	{ name: 'Bosh sahifa', href: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
	{ name: 'Katalog', href: '/catalog', icon: <BookOpenCheck className="w-5 h-5" /> },
	{ name: 'Imtihon', href: '/exam', icon: <BookCheck className="w-5 h-5" /> },
	{ name: 'Mening Sertifikatim', href: '/certification', icon: <Award className="w-5 h-5" /> },
    { name: 'Yangiliklar', href: '/news', icon: <Newspaper className="w-5 h-5" /> },
	{ name: 'Bildirishnomalar', href: '/notification', icon: <Bell className="w-5 h-5" /> },
]

export const TeacherMenu = [
	{ name: 'Bosh sahifa', href: '/teacher', icon: <Home className="w-5 h-5" /> },
    { name: 'Yangiliklar', href: '/news', icon: <Newspaper className="w-5 h-5" /> },
	{ name: 'Bildirishnomalar', href: '/notification', icon: <Bell className="w-5 h-5" /> },
]

export const SupportMenu = [
    { name: 'Bosh sahifa', href: '/support', icon: <Headset className="w-5 h-5" /> }
]
