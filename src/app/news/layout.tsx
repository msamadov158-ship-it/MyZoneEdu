import Layout from '@/components/layout/LayoutWrapper'
import { StudentMenu } from '@/constants/menu'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen position-relative bg-gradient-to-br from-gray-50 to-gray-100 ">
            <Layout menuItems={StudentMenu} />
            <main className="w-full fixed top-20 lg:top-21 left-0 lg:left-80 lg:w-[calc(100%-320px)] h-[calc(100dvh-80px)] lg:h-[calc(100dvh-84px)] overflow-y-auto p-2 sm:p-4 md:p-6">{children}</main>
        </div>
    )
}
