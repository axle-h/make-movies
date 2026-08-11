import {
  Box,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Portal,
  Menu,
  Dialog,
  Text,
  FlexProps,
  IconProps,
  BoxProps,
  CloseButton,
  Container,
} from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { Link } from '@/components/link'
import {
  AppIcon,
  AppName,
  MovieIcon,
  CloudIcon,
  DownloadIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from '@/components/icons'
import { useLocation } from '@tanstack/react-router'
import React, { useState } from 'react'
import { displayName, UserInfo, useUser } from '@/client/user'
import { LogoutIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

interface NavItemProps extends FlexProps {
  NavIcon: React.ComponentType<IconProps>
  href: string
  children: React.ReactNode
  onClose: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

function NavItem({ NavIcon, href, children, onClose, ...rest }: NavItemProps) {
  const { pathname } = useLocation()
  const current = pathname.startsWith(href)
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="100%"
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        my="1"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'gray.600',
          color: 'white',
        }}
        bg={current ? 'gray.300' : undefined}
        _dark={{
          bg: current ? 'gray.700' : undefined,
        }}
        onClick={onClose}
        {...rest}
        w="100%"
      >
        <NavIcon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
        />
        {children}
      </Flex>
    </Link>
  )
}

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      _dark={{
        bg: 'gray.900',
        borderRightColor: 'gray.700',
      }}
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent={{ base: 'space-between', md: 'center' }}
      >
        <Flex alignItems="center">
          <AppIcon />
          <AppName />
        </Flex>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <NavItem NavIcon={MovieIcon} href="/movies" onClose={onClose}>
        Movies
      </NavItem>

      <NavItem NavIcon={DownloadIcon} href="/downloads" onClose={onClose}>
        Downloads
      </NavItem>

      <NavItem NavIcon={CloudIcon} href="/scraper" onClose={onClose}>
        Scraper
      </NavItem>
    </Box>
  )
}

function LogoutButton() {
  const [isLoading, setLoading] = useState(false)

  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
        <Button variant="plain">
          <LogoutIcon /> Logout
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                Logout
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text>Are you sure you want to logout?</Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                loading={isLoading}
                loadingText="Logging out..."
                onClick={() => {
                  setLoading(true)
                  // A real navigation, not a fetch: it has to follow the redirect
                  // chain out to the identity provider.
                  window.location.href = '/auth/logout'
                }}
                ml={3}
              >
                <LogoutIcon />
                Logout
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

function UserMenu({ user }: { user: UserInfo }) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button rounded={'full'} variant={'plain'} cursor={'pointer'} minW={0}>
          <Avatar size={'sm'} name={displayName(user)} colorPalette={'blue'} />
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="logout" asChild>
            <LogoutButton />
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

export interface MobileNavProps extends FlexProps {
  onOpen?(): void
}

export function MobileNav({ onOpen, ...rest }: MobileNavProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: user } = useUser()
  return (
    <Flex
      px={4}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      justifyContent="space-between"
      _dark={{
        bg: 'gray.900',
        borderBottomColor: 'gray.700',
      }}
      {...rest}
    >
      {onOpen ? (
        <>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
          <AppIcon display={{ base: 'flex', md: 'none' }} />
        </>
      ) : (
        <>
          <Box />
          <Flex alignItems="center">
            <AppIcon />
            <AppName />
          </Flex>
        </>
      )}

      <HStack gap={{ base: '1', md: '3' }}>
        {user ? <UserMenu user={user} /> : <></>}

        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="change colour mode"
        >
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </HStack>
    </Flex>
  )
}

export function SecureNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  return (
    <Box minH="100dvh">
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />

      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="start"
        size="full"
      >
        <Portal>
          <Drawer.Positioner>
            <Drawer.Content>
              <SidebarContent onClose={onClose} />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <MobileNav
        ml={{ base: 0, md: 60 }}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
        onOpen={() => setOpen(true)}
      />

      <Box ml={{ base: 0, md: 60 }}>
        <Container maxW="1200px" p={4}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
