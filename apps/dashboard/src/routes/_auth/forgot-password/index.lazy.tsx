import { Logo } from '@/features/auth/login/ui/components/Logo'
import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/forgot-password/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white px-4 text-center">
      <Logo />

      <h1 className="mt-6 text-xl font-semibold text-gray-900">
        Bantuan Reset Akses
      </h1>

      <p className="mt-3 max-w-md text-sm text-gray-600">
        Untuk keamanan akun, proses reset akses dilakukan melalui Admin atau Tim IT instansi Anda.
      </p>

      <p className="mt-2 max-w-md text-sm text-gray-600">
        Silakan hubungi Admin Instansi atau Tim IT setempat untuk mendapatkan bantuan lebih lanjut.
      </p>
      <Link
        to="/login"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Kembali ke Halaman Masuk
      </Link>
    </div>
  )
}
