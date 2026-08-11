import {
  Card,
  Container,
  Heading,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { SearchIcon } from '@/components/icons'
import { useClient } from '@/client'
import { Link } from '@/components/link'
import { useState } from 'react'
import useDebounce from '@/components/debounce'
import { useSearchParams } from 'react-router'
import { Pagination } from '@/components/pagination'
import { ErrorAlert, Loading, NoData } from '@/components/alert'
import { MovieCardBody, MovieImage } from '@/components/movies/movie'

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

export default function MoviesHome() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const currentPage = Number(params.get('page')) || 1

  const [searchTerm, setSearchTerm] = useState(search)

  function navigate({
    nextPage,
    nextSearchTerm,
  }: {
    nextPage?: number
    nextSearchTerm?: string
  }) {
    const nextSearch = nextSearchTerm ?? search
    const page = nextPage ?? currentPage
    const queryParams = new URLSearchParams()

    if (nextSearch) {
      queryParams.set('search', nextSearch)
    }
    queryParams.set('page', String(page))

    setParams(queryParams, { replace: true })
  }

  const handleSearch = useDebounce(
    (nextSearchTerm: string) => navigate({ nextSearchTerm, nextPage: 1 }),
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
        page={currentPage}
        updatePage={(nextPage) => navigate({ nextPage })}
      />
    </Container>
  )
}
