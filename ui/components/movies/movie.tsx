import { Movie } from "@/client/models";
import {
  Badge,
  Box,
  Card,
  Flex,
  FlexProps,
  Image,
  ImageProps,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { CheckCircleIcon, StarIcon } from "@/components/icons";
import { Tooltip } from "@/components/ui/tooltip";

export function MovieImage({ movie, ...props }: { movie: Movie } & ImageProps) {
  return (
    <Image
      src={`/api/v1/movie/${movie.id}/image`}
      alt={movie.title ?? ""}
      style={{ objectFit: "cover" }}
      {...props}
    />
  );
}

export interface MovieCardBodyProps {
  movie: Movie;
  descriptionLines?: TextProps["lineClamp"];
  displayDescription?: FlexProps["display"];
}

export function MovieCardBody({
  movie,
  descriptionLines,
  displayDescription,
}: MovieCardBodyProps) {
  return (
    <Card.Body>
      <Card.Title>
        {movie.inLibrary ? (
          <Tooltip content="Already downloaded">
            <CheckCircleIcon color="green" mr={2} />
          </Tooltip>
        ) : (
          <></>
        )}

        <Text mr={2} style={{ display: "inline" }}>
          {movie.title}
        </Text>

        <Badge colorPalette="purple">{movie.year}</Badge>
      </Card.Title>

      <Stack gap={1} mb={3}>
        <Text py={2}>
          {movie.genres
            ?.toSorted((g1, g2) => g1.localeCompare(g2))
            ?.map((g) => (
              <Badge mr="1" key={g} colorPalette="blue">
                {g}
              </Badge>
            ))}
        </Text>

        <Flex>
          <Box as={StarIcon} color="orange.400" />
          <Text ml={1} fontSize="sm">
            <b>{movie.rating}</b>
          </Text>
        </Flex>
      </Stack>

      <Card.Description
        display={displayDescription}
        lineClamp={descriptionLines}
      >
        {movie.description}
      </Card.Description>
    </Card.Body>
  );
}
