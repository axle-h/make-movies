import { Alert, Box } from '@chakra-ui/react'
import { LeftAccentAlert } from '@/components/alert'
import { Link } from '@/components/link'

export default function NotFoundPage() {
  return (
    <LeftAccentAlert status="error">
      <Alert.Indicator />
      <Box>
        <Alert.Title style={{ textTransform: 'capitalize' }}>
          Page not found
        </Alert.Title>
        <Alert.Description>
          Go back <Link href="/">home</Link>
        </Alert.Description>
      </Box>
    </LeftAccentAlert>
  )
}
