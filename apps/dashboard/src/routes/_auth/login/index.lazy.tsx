import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/login/ui/forms/Login'

export const Route = createLazyFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='grid grid-cols-2 h-screen p-4'>
    <div className='flex flex-col gap-2 items-start justify-center bg-red-500 p-4 md:p-12 lg:p-20'>
      <div className="flex flex-col gap-2 bg-yellow-500">
        <img src="https://picsum.dev/128/128" alt="Login Page" className='w-12 h-12 rounded-full' />
        <h1>Login</h1>
        <p>Sign in to your account</p>
      </div>
      <LoginForm />
    </div>
    <div>
      <img src="https://picsum.dev/1200" alt="Login Page" />
    </div>
  </div>
}
