import { Outlet } from 'react-router'
import { SecureNav } from '@/components/nav'
import { Toaster } from '@/components/ui/toaster'

export function SecureLayout() {
  // No auth check here: the api gates index.html itself, so reaching this component
  // at all means we are signed in.
  return (
    <SecureNav>
      <Toaster />
      <Outlet />
    </SecureNav>
  )
}
