'use client';

import {
    FiHome,
    FiLogIn,
    FiLogOut,
} from "react-icons/fi"
import {IconType} from "react-icons"
import {CheckIcon, CloseIcon, IconProps} from "@chakra-ui/icons"
import {Icon} from "@chakra-ui/react"

function toChakraIcon(type: IconType) {
    return function ChakraIcon(props: IconProps) {
        return <Icon as={type} {...props} />
    }
}


export function BoolIcon({ value }: { value: boolean }) {
    return value ? <CheckIcon color='green'/> : <CloseIcon color='red'/>;
}

export const HomeIcon = toChakraIcon(FiHome)
export const LoginIcon = toChakraIcon(FiLogIn)
export const LogoutIcon = toChakraIcon(FiLogOut)
