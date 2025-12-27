import { Link } from "@tanstack/react-router"

export const NavbarMenu = () => {
    return (
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
            <Link
                to="/users"
                className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
                Users
            </Link>
            <Link
                to="/about"
                className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
                About
            </Link>
        </nav>
    )
}