import type { ReactNode } from 'react'
import { NavbarMenu } from './NavbarMenu'

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen w-full">
            {/* Sidebar Sederhana */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="font-bold text-xl text-gray-800">Gizi Dashboard</h1>
                </div>

                <NavbarMenu />

                <div className="p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-400">© 2024 Gizi App</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
