'use client'

import {
  Badge,
  ButtonGroup,
  Card,
  Container,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useClient } from '@/client'
import { RefreshIcon } from '@/components/icons'
import { ErrorAlert, Loading, NoData } from '@/components/alert'
import { Pagination } from '@/components/pagination'
import { Download, DownloadPaginatedData } from '@/client/models'
import { MovieImage } from '@/components/movies/movie'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/progress'

interface ListPagination {
  page: number
  limit: number
}

function DownloadControls({ onRefresh }: { onRefresh: () => Promise<any> }) {
  return (
    <ButtonGroup variant="outline" mb={4}>
      <Button onClick={onRefresh}>
        <RefreshIcon /> Refresh
      </Button>
    </ButtonGroup>
  )
}

function DownloadStatus({ download }: { download: Download }) {
  const percentDone = download.stats?.percentDone
    ? Math.round((download.stats.percentDone * 100 + Number.EPSILON) * 100) /
      100
    : null

  const progressBar =
    download.complete === true ? (
      <Progress size="sm" value={100} colorPalette="green" />
    ) : percentDone ? (
      <Progress value={percentDone} size="sm" />
    ) : (
      <Progress size="sm" value={null} />
    )

  return (
    <Stack>
      {progressBar}
      <Text fontSize="xs" as="i">
        {download.complete
          ? 'Downloaded'
          : percentDone
            ? `${percentDone}%`
            : ''}
        <Eta value={download.stats?.eta} />
      </Text>
    </Stack>
  )
}

function Eta({ value }: { value?: string | null }) {
  if (!value) return <></>
  const match = value.match(/(\d{2}):(\d{2}):(\d{2})/)
  if (!match) {
    return <></>
  }

  const str = ['hr', 'min', 'sec']
    .map((name, index) => {
      const componentValue = parseInt(match[index + 1])
      if (componentValue === 1) {
        return `1 ${name}`
      } else if (componentValue > 0) {
        return `${componentValue} ${name}s`
      }
    })
    .join(' ')

  return str.length > 0 ? <> - eta {str}</> : <></>
}

function DownloadList({ downloads }: { downloads?: DownloadPaginatedData }) {
  if (!downloads?.data?.length) {
    return <NoData />
  }

  const cards = downloads.data.map((download) => {
    if (!download.name) {
      return <></>
    }
    const match = download.name.match(/^(.+) \((\d{4})\)$/)
    const title = match ? match[1] : download.name
    const year = match ? parseInt(match[2]) : null
    return (
      <Card.Root
        key={download.id}
        flexDirection="row"
        overflow="hidden"
        variant="outline"
        height={{ base: 180, sm: 230 }}
        my={3}
      >
        <MovieImage movie={{ id: download.movieId, title }} maxW={200} />
        <Card.Body>
          <Heading size="md" mb={4}>
            <Text mr={2} style={{ display: 'inline' }}>
              {title}
            </Text>
            {year ? <Badge colorPalette="purple">{year}</Badge> : <></>}
          </Heading>
          <DownloadStatus download={download} />
        </Card.Body>
      </Card.Root>
    )
  })
  return <>{cards}</>
}

export default function DownloadsHome() {
  const [pageCount, updatePageCount] = useState<number | null>(null)
  const [pagination, updatePagination] = useState<ListPagination>({
    page: 1,
    limit: 10,
  })
  const {
    data: downloads,
    error,
    isLoading,
    mutate,
  } = useClient({
    api: 'list-downloads',
    ...pagination,
  })

  async function refresh() {
    if (pagination.page > 1) {
      updatePagination({ ...pagination, page: 1 })
    } else {
      await mutate()
    }
  }

  return (
    <Container py={4}>
      <Heading mb={4}>Downloads</Heading>
      <DownloadControls onRefresh={refresh} />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : (
        <DownloadList downloads={downloads} />
      )}
      {pageCount ? (
        <Pagination
          current={pagination.page}
          count={pageCount}
          onPaginate={(page) => updatePagination({ ...pagination, page })}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}
