import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from '@tanstack/react-router'
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'

/**
 * Generic href based link, for call sites that build a path as a string. Where the target is
 * known statically, prefer the router's own typed Link with to and params.
 */
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
      <RouterLink to={href as RouterLinkProps['to']}>{children}</RouterLink>
    </ChakraLink>
  )
}
