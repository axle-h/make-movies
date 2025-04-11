"use client";

import {
  Card,
  Container,
  Heading,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { SearchIcon } from "@/components/icons";
import { useClient } from "@/client";
import { Link } from "@/components/link";
import React, { useEffect, useState } from "react";
import useDebounce from "@/components/debounce";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { ErrorAlert, Loading, NoData } from "@/components/alert";
import { MovieCardBody, MovieImage } from "@/components/movies/movie";

function MovieList({
  searchTerm,
  page,
  updatePage,
}: {
  searchTerm: string;
  page: number;
  updatePage: (page: number) => void;
}) {
  const limit = 10;
  const [pageCount, updatePageCount] = useState<number | null>(null);
  const {
    data: movies,
    error,
    isLoading,
  } = useClient({
    api: "list-movies",
    page,
    limit,
    search: searchTerm,
  });

  useEffect(() => {
    if (movies?.count) {
      updatePageCount(Math.ceil(movies.count / limit));
    }
  }, [movies?.count, limit]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!movies?.data?.length) {
    return <NoData />;
  }

  const cards = movies.data.map((movie) => (
    <LinkBox
      as={Card.Root}
      key={movie.id}
      flexDirection="row"
      overflow="hidden"
      height={{ base: 180, sm: 230 }}
      my={3}
    >
      <LinkOverlay as={Link} href={`/movies/${movie.id}`} />
      <MovieImage movie={movie} maxW={200} />
      <MovieCardBody
        movie={movie}
        descriptionLines={{ sm: 2, md: 3 }}
        displayDescription={{ base: "none", sm: "block" }}
      />
    </LinkBox>
  ));
  return (
    <>
      {cards}
      {pageCount ? (
        <Pagination current={page} count={pageCount} onPaginate={updatePage} />
      ) : (
        <></>
      )}
    </>
  );
}

export default function MoviesHome({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = React.use(searchParams);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(params.search || "");
  const currentPage = Number(params.page) || 1;

  function navigate({
    nextPage,
    nextSearchTerm,
  }: {
    nextPage?: number;
    nextSearchTerm?: string;
  }) {
    router.replace(`?search=${nextSearchTerm}&page=${nextPage || currentPage}`);
  }

  const handleSearch = useDebounce(
    (nextSearchTerm: string) => navigate({ nextSearchTerm, nextPage: 1 }),
    500,
  );

  return (
    <Container py={4}>
      <Heading mb={4}>Movies</Heading>
      <InputGroup
        mb={4}
        startAddon={<SearchIcon color="gray.300" pointerEvents="none" />}
      >
        <Input
          placeholder="Search movies"
          value={searchTerm}
          onChange={(event) => {
            const { value } = event.target;
            setSearchTerm(value);
            // Debounce the search callback
            handleSearch(value);
          }}
          size="lg"
        />
      </InputGroup>

      <MovieList
        searchTerm={params.search ?? ""}
        page={currentPage}
        updatePage={(nextPage) => navigate({ nextPage })}
      />
    </Container>
  );
}
