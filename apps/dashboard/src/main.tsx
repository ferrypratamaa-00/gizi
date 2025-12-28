import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/App.css"
import "@repo/ui/styles/globals.css"
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <div>Loading...</div>,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
