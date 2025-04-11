"use client";

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
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Link } from "@/components/link";
import {
  AppIcon,
  AppName,
  MovieIcon,
  CloudIcon,
  DownloadIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "@/components/icons";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import React, { useState } from "react";
import { LogoutIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

interface NavItemProps extends FlexProps {
  NavIcon: React.ComponentType<IconProps>;
  href: string;
  children: React.ReactNode;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const pathName = usePathname();

  function NavItem({ NavIcon, href, children, ...rest }: NavItemProps) {
    const current = pathName.startsWith(href);
    return (
      <Link
        href={href}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
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
            bg: "gray.600",
            color: "white",
          }}
          bg={current ? "gray.300" : undefined}
          _dark={{
            bg: current ? "gray.700" : undefined,
          }}
          onClick={onClose}
          {...rest}
          w="100%"
        >
          <NavIcon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
          />
          {children}
        </Flex>
      </Link>
    );
  }

  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      _dark={{
        bg: "gray.900",
        borderRightColor: "gray.700",
      }}
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent={{ base: "space-between", md: "center" }}
      >
        <Flex alignItems="center">
          <AppIcon />
          <AppName />
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <NavItem NavIcon={MovieIcon} href="/movies">
        Movies
      </NavItem>

      <NavItem NavIcon={DownloadIcon} href="/downloads">
        Downloads
      </NavItem>

      <NavItem NavIcon={CloudIcon} href="/scraper">
        Scraper
      </NavItem>
    </Box>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
        <Button variant="plain">
          <LogoutIcon /> Logout
        </Button>
      </Dialog.Trigger>
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
              setLoading(true);
              router.replace("/logout");
            }}
            ml={3}
          >
            <LogoutIcon />
            Logout
          </Button>
        </Dialog.Footer>
        <Dialog.CloseTrigger />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function UserMenu({ session }: { session: Session }) {
  if (!session.user) {
    return <></>;
  }

  let displayName = "";
  if ("given_name" in session.user) {
    displayName += session.user.given_name + " ";
  }
  if ("family_name" in session.user) {
    displayName += session.user.family_name;
  }

  if (!displayName) {
    displayName = session.user.name || "";
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button rounded={"full"} variant={"plain"} cursor={"pointer"} minW={0}>
          <Avatar size={"sm"} name={displayName} colorPalette={"blue"} />
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
  );
}

export interface MobileNavProps extends FlexProps {
  session?: Session | null;
  onOpen?(): void;
}

export function MobileNav({ onOpen, session, ...rest }: MobileNavProps) {
  const { colorMode, toggleColorMode } = useColorMode();
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
        bg: "gray.900",
        borderBottomColor: "gray.700",
      }}
      {...rest}
    >
      {!!onOpen ? (
        <>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="ghost"
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
          <AppIcon display={{ base: "flex", md: "none" }} />
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

      <HStack gap={{ base: "1", md: "3" }}>
        {!!session ? <UserMenu session={session} /> : <></>}

        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="change colour mode"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </HStack>
    </Flex>
  );
}

export function SecureNav({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  return (
    <Box minH="100dvh">
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
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
        justifyContent={{ base: "space-between", md: "flex-end" }}
        onOpen={() => setOpen(true)}
        session={session}
      />

      <Box ml={{ base: 0, md: 60 }}>
        <Container maxW="1200px" p={4}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
