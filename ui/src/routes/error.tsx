import { LeftAccentAlert } from '@/components/alert'
import { Alert, Box } from '@chakra-ui/react'
import { Link } from '@/components/link'
import { useRouteError } from 'react-router'
import { useEffect } from 'react'

export function ErrorPage() {
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <LeftAccentAlert status="error">
      <Alert.Indicator />
      <Box>
        <Alert.Title style={{ textTransform: 'capitalize' }}>
          Something went wrong
        </Alert.Title>
        <Alert.Description>
          Go back <Link href="/">home</Link>
        </Alert.Description>
      </Box>
    </LeftAccentAlert>
  )
}
