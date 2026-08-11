import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Alert, Box } from '@chakra-ui/react'
import { SecureNav } from '@/components/nav'
import { Toaster } from '@/components/ui/toaster'
import { LeftAccentAlert } from '@/components/alert'
import { Link } from '@/components/link'

export const Route = createRootRoute({
  // No auth check: the api gates index.html itself, so getting here means we are signed in.
  component: () => (
    <SecureNav>
      <Toaster />
      <Outlet />
    </SecureNav>
  ),
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

// These render in place of the Outlet, so they are already inside SecureNav.
function NotFound() {
  return <Message title="Page not found" />
}

function RouteError({ error }: { error: Error }) {
  console.error(error)
  return <Message title="Something went wrong" />
}

function Message({ title }: { title: string }) {
  return (
    <LeftAccentAlert status="error">
      <Alert.Indicator />
      <Box>
        <Alert.Title style={{ textTransform: 'capitalize' }}>
          {title}
        </Alert.Title>
        <Alert.Description>
          Go back <Link href="/movies">home</Link>
        </Alert.Description>
      </Box>
    </LeftAccentAlert>
  )
}
