import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/login/ui/forms/Login'
import { Logo } from '@/features/auth/login/ui/components/Logo'
import { NutritionCard } from '@/features/auth/login/ui/components/NutritionCard'

export const Route = createLazyFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* Left Panel - Form */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative'>
        <div className='w-full max-w-sm flex flex-col gap-8'>
          {/* Logo */}
          <Logo />
          {/* Login Form */}
          <LoginForm />
        </div>
        {/* Footer */}
        <div className='absolute bottom-8 text-sm text-gray-500'>
            &copy; 2025 Gizi Platform. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className='hidden lg:flex w-1/2 bg-[#053d2e] relative items-center justify-center overflow-hidden p-12'>
        {/* Abstract Background Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0c5a45] rounded-full blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0c5a45] rounded-full blur-[80px] opacity-40 -translate-x-1/3 translate-y-1/3" />

        <div className='relative z-10 flex flex-col items-center text-center max-w-lg'>
          <h2 className='text-5xl md:text-6xl font-serif text-white mb-4 leading-tight'>
            Enter the <i className='font-sans font-light opacity-90'>Future</i>
          </h2>
          <p className='text-3xl font-light text-white/80 mb-12'>
             of Nutrition Monitoring, <br/> <strong className='text-white'>today</strong>
          </p>

          {/* Card UI Visual */}
         <NutritionCard />
        </div>
      </div>
    </div>
  )
}
