'use client';

import {
    Box,
    Button,
    Flex,
    HStack,
    Image,
    IconButton,
    Stack,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    Menu,
    MenuButton,
    Avatar,
    MenuList,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader, AlertDialogBody, AlertDialogFooter, MenuItem,
} from '@chakra-ui/react'
import {Link} from '@chakra-ui/next-js'
import {CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {usePathname, useRouter} from "next/navigation";
import {Session} from "next-auth";
import React, {useState} from "react";
import {LogoutIcon} from "@/components/icons";

const NavLink = ({name, href, onClick}: { name: string, href: string, onClick: () => void }) => {
    const pathName = usePathname()
    const bgColor = useColorModeValue('gray.300', 'gray.700')
    return (
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: bgColor,
            }}
            bg={pathName === href ? bgColor : undefined}
            href={href}
            onClick={onClick}>
            {name}
        </Link>
    )
}

function LogoutAlert({ onClose, isOpen }: { onClose(): void, isOpen: boolean }) {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const cancelRef = React.useRef()

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef as any}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Logout
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to logout?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef as any} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red'
                                isLoading={isLoading}
                                onClick={() => {
                                    setLoading(true)
                                    router.replace('/logout');
                                }}
                                ml={3}>
                            Logout
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

function UserMenu({ session }: { session: Session }) {
    const logoutDisclosure = useDisclosure()

    if (!session.user) {
        return <></>
    }

    let displayName = ''
    if ('given_name' in session.user) {
        displayName += session.user.given_name + ' '
    }
    if ('family_name' in session.user) {
        displayName += session.user.family_name
    }

    if (!displayName) {
        displayName = session.user.name || ''
    }

    return (
        <>
            <Menu>
                <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar size={'sm'} name={displayName} />
                </MenuButton>
                <MenuList>
                    <MenuItem icon={<LogoutIcon />} onClick={logoutDisclosure.onOpen}>Logout</MenuItem>
                </MenuList>
            </Menu>
            <LogoutAlert {...logoutDisclosure} />
        </>
    )
}

export function Nav({ session }: { session: Session | null }) {
    const {colorMode, toggleColorMode} = useColorMode()
    const {isOpen, onOpen, onClose} = useDisclosure()

    const navLinks = !!session ? (<>
        <NavLink name='Movies' href='/movies' onClick={onClose} />
        <NavLink name='Scraper' href='/scraper' onClick={onClose} />
        <NavLink name='Downloads' href='/downloads' onClick={onClose} />
    </>) : <></>

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        aria-label={'Open Menu'}
                        display={{md: 'none'}}
                        onClick={isOpen ? onClose : onOpen}
                    />

                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link href='/'>
                                <Image src='/icon.png' boxSize='40px' objectFit='cover' alt='make-movies'  />
                            </Link>
                        </Box>
                        <HStack as={'nav'} spacing={4} display={{base: 'none', md: 'flex'}}>
                            {navLinks}
                        </HStack>
                    </HStack>


                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            {!!session ? <UserMenu session={session} /> : <></>}
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{md: 'none'}}>
                        <Stack as={'nav'} spacing={4}>
                            {navLinks}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}