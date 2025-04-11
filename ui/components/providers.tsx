"use client";

import {
  createSystem,
  defaultConfig,
  ChakraProvider,
  defineConfig,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { ColorModeProvider } from "@/components/ui/color-mode";

const system = createSystem(
  defaultConfig,
  defineConfig({
    theme: {
      tokens: {
        fonts: {
          heading: { value: "var(--font-rubik)" },
          body: { value: "var(--font-rubik)" },
        },
      },
    },
  }),
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
