"use client";

import { Alert, Box, Center, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

type AlertProps = Alert.RootProps;

export function LeftAccentAlert(props: AlertProps) {
  return (
    <Alert.Root
      {...props}
      variant="subtle"
      borderStartWidth="3px"
      borderStartColor="colorPalette.600"
    />
  );
}

export function ErrorAlert({
  error,
  title = "Something went wrong",
  ...props
}: AlertProps & { error: any; title?: string }) {
  useEffect(() => console.log(error), [error]);
  return (
    <LeftAccentAlert {...props} status="error">
      <Alert.Indicator />
      <Box>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{error.toString()}</Alert.Description>
      </Box>
    </LeftAccentAlert>
  );
}

export function Loading() {
  return (
    <Center py={4}>
      <Spinner />
    </Center>
  );
}

export function NotFound({ entity, id }: { entity: string; id: string }) {
  return (
    <LeftAccentAlert status="error">
      <Alert.Indicator />
      <Box>
        <Alert.Title style={{ textTransform: "capitalize" }}>
          {entity} not found
        </Alert.Title>
        <Alert.Description>
          No {entity} exists with id {id}
        </Alert.Description>
      </Box>
    </LeftAccentAlert>
  );
}

export function NoData() {
  return (
    <LeftAccentAlert status="info">
      <Alert.Indicator />
      <Alert.Title>No data</Alert.Title>
    </LeftAccentAlert>
  );
}
