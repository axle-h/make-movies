'use client'

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiCloud,
  FiDownload,
  FiExternalLink,
  FiFilm,
  FiHome,
  FiLock,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiSun,
  FiX,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { Box, BoxProps, IconProps, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import NextImage from 'next/image'

function toChakraIcon(IconType: IconType) {
  return function ChakraIcon(props: IconProps) {
    return (
      <Icon {...props}>
        <IconType />
      </Icon>
    )
  }
}

export function AppIcon(props: BoxProps) {
  return (
    <Box {...props} asChild>
      <NextImage
        src="/icon.png"
        alt="make-movies"
        width={40}
        height={40}
        unoptimized
      />
    </Box>
  )
}

export function AppName() {
  return (
    <Text ml={1}>
      <b>MAKE</b> Movies
    </Text>
  )
}

export const AddIcon = toChakraIcon(FiPlus)
export const MenuIcon = toChakraIcon(FiMenu)
export const SunIcon = toChakraIcon(FiSun)
export const MoonIcon = toChakraIcon(FiMoon)
export const ArrowBackIcon = toChakraIcon(FiArrowLeft)
export const ArrowForwardIcon = toChakraIcon(FiArrowRight)
export const CheckIcon = toChakraIcon(FiCheck)
export const CloseIcon = toChakraIcon(FiX)
export const HomeIcon = toChakraIcon(FiHome)
export const LoginIcon = toChakraIcon(FiLogIn)
export const LogoutIcon = toChakraIcon(FiLogOut)
export const CheckCircleIcon = toChakraIcon(FiCheckCircle)
export const StarIcon = toChakraIcon(FiStar)
export const ExternalLinkIcon = toChakraIcon(FiExternalLink)
export const RefreshIcon = toChakraIcon(FiRefreshCw)
export const DownloadIcon = toChakraIcon(FiDownload)
export const LockIcon = toChakraIcon(FiLock)
export const SearchIcon = toChakraIcon(FiSearch)
export const MovieIcon = toChakraIcon(FiFilm)
export const CloudIcon = toChakraIcon(FiCloud)

export function BoolIcon({ value }: { value: boolean }) {
  return value ? <CheckIcon color="green" /> : <CloseIcon color="red" />
}
