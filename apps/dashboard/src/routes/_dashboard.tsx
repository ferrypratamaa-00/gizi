import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/shared/ui/layouts/DashboardLayout'

export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
