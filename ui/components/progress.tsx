import { Progress as ChakraProgress } from "@chakra-ui/react";

export function Progress(props: ChakraProgress.RootProps) {
  return (
    <ChakraProgress.Root {...props}>
      <ChakraProgress.Track>
        <ChakraProgress.Range />
      </ChakraProgress.Track>
    </ChakraProgress.Root>
  );
}
