import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='grid grid-cols-2 h-screen'>
    <div>
      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Login Page" />
    </div>
    <div>
      <h1>Login</h1>
    </div>
  </div>
}
