import React from "react"
import {Nav} from "@/components/nav";
import {Alert, AlertDescription, AlertIcon, AlertTitle, Box, Container, Flex} from "@chakra-ui/react";
import {auth, isAuthorized} from "@/auth";

export default async function PublicLayout({ children, }: { children: React.ReactNode }) {
    const session = await auth()
    return (
        <Flex h="100dvh" flexDirection="column">
            {!!session?.user && !isAuthorized(session.user)
                ? (
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>Looks like your account does not have the required roles to use Make Money.</AlertDescription>
                    </Alert>
                ) : <></>
            }

            <Nav session={session} />

            <Flex alignItems="center" justifyContent="center" flexGrow={1}>
                <Container maxW='600px' p={4}>
                    {children}
                </Container>
            </Flex>
        </Flex>
    )
}