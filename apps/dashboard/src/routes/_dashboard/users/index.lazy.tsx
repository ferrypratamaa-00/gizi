import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/users/"!</div>
}
