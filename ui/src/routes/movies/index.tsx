import {
  Card,
  Container,
  Heading,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { SearchIcon } from '@/components/icons'
import { useClient } from '@/client'
import { Link } from '@/components/link'
import { useState } from 'react'
import useDebounce from '@/components/debounce'
import { Pagination } from '@/components/pagination'
import { ErrorAlert, Loading, NoData } from '@/components/alert'
import { MovieCardBody, MovieImage } from '@/components/movies/movie'

// Both optional so that a plain link to /movies does not have to supply them. Undefined
// is dropped from the query string, which keeps the urls the same as they were: page is
// always present, search only when there is one.
interface MoviesSearch {
  search?: string
  page?: number
}

export const Route = createFileRoute('/movies/')({
  validateSearch: (input: Record<string, unknown>): MoviesSearch => ({
    search:
      typeof input.search === 'string' && input.search
        ? input.search
        : undefined,
    page: Number(input.page) || 1,
  }),
  component: MoviesHome,
})

function MovieList({
  searchTerm,
  page,
  updatePage,
}: {
  searchTerm: string
  page: number
  updatePage: (page: number) => void
}) {
  const limit = 10
  const {
    data: movies,
    error,
    isLoading,
  } = useClient({
    api: 'list-movies',
    page,
    limit,
    search: searchTerm,
  })

  const pageCount = movies?.count ? Math.ceil(movies.count / limit) : null

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  if (!movies?.data?.length) {
    return <NoData />
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
        displayDescription={{ base: 'none', sm: 'block' }}
      />
    </LinkBox>
  ))
  return (
    <>
      {cards}
      {pageCount ? (
        <Pagination current={page} count={pageCount} onPaginate={updatePage} />
      ) : (
        <></>
      )}
    </>
  )
}

function MoviesHome() {
  const { search = '', page = 1 } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [searchTerm, setSearchTerm] = useState(search)

  const handleSearch = useDebounce(
    (nextSearch: string) =>
      navigate({
        search: { search: nextSearch || undefined, page: 1 },
        replace: true,
      }),
    500
  )

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
            const { value } = event.target
            setSearchTerm(value)
            // Debounce the search callback
            handleSearch(value)
          }}
          size="lg"
        />
      </InputGroup>

      <MovieList
        searchTerm={search}
        page={page}
        updatePage={(nextPage) =>
          navigate({
            search: (previous) => ({ ...previous, page: nextPage }),
            replace: true,
          })
        }
      />
    </Container>
  )
}
