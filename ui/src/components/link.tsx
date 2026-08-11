import { Link as RouterLink } from 'react-router'
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'

export function Link({
  external = false,
  href,
  children,
  ...props
}: { href: string; external?: boolean } & ChakraLinkProps) {
  if (external) {
    return (
      <ChakraLink {...props} href={href} cursor="pointer">
        {children}
        <ExternalLinkIcon />
      </ChakraLink>
    )
  }

  return (
    <ChakraLink {...props} asChild cursor="pointer">
      <RouterLink to={href}>{children}</RouterLink>
    </ChakraLink>
  )
}
