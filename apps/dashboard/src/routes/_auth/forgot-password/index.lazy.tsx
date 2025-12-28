import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/forgot-password/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/forgot-password/"!</div>
}
