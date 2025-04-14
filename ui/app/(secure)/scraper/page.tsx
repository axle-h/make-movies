'use client'

import {
  ButtonGroup,
  Container,
  Heading,
  Spinner,
  Table,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { apiClient, useClient } from '@/client'
import { ScrapePaginatedData } from '@/client/models'
import { Pagination } from '@/components/pagination'
import { BoolIcon, AddIcon, RefreshIcon } from '@/components/icons'
import { NoData, ErrorAlert, Loading } from '@/components/alert'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'

interface ListPagination {
  page: number
  limit: number
}

function ScrapeControls({
  onRefresh,
  onNew,
}: {
  onRefresh: () => Promise<any>
  onNew: () => Promise<any>
}) {
  return (
    <ButtonGroup variant="outline" mb={4}>
      <Button colorPalette="blue" onClick={onNew}>
        <AddIcon /> New
      </Button>
      <Button onClick={onRefresh}>
        <RefreshIcon /> Refresh
      </Button>
    </ButtonGroup>
  )
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const numberFormatter = new Intl.NumberFormat('en-US')

function ScrapeList({ scrapes }: { scrapes?: ScrapePaginatedData }) {
  if (!scrapes?.data?.length) {
    return <NoData />
  }

  const rows = scrapes.data.map((s) => (
    <Table.Row key={s.id}>
      <Table.Cell>{dateFormatter.format(s.startDate ?? new Date())}</Table.Cell>
      <Table.Cell>
        {s.success !== undefined ? (
          <BoolIcon value={s.success || false} />
        ) : (
          <Spinner />
        )}
      </Table.Cell>
      <Table.Cell>{numberFormatter.format(s.movieCount ?? 0)}</Table.Cell>
      <Table.Cell>{numberFormatter.format(s.torrentCount ?? 0)}</Table.Cell>
    </Table.Row>
  ))

  return (
    <Table.Root variant="line">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Start date</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Movies</Table.ColumnHeader>
          <Table.ColumnHeader>Torrents</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>{rows}</Table.Body>
    </Table.Root>
  )
}

export default function ScraperHome() {
  const [pageCount, updatePageCount] = useState<number | null>(null)
  const [pagination, updatePagination] = useState<ListPagination>({
    page: 1,
    limit: 10,
  })
  const {
    data: scrapes,
    error,
    isLoading,
    mutate,
  } = useClient({
    api: 'list-scrapes',
    ...pagination,
  })

  useEffect(() => {
    if (scrapes?.count) {
      updatePageCount(Math.ceil(scrapes.count / pagination.limit))
    }
  }, [scrapes?.count, pagination.limit])

  async function refresh() {
    if (pagination.page > 1) {
      updatePagination({ ...pagination, page: 1 })
    } else {
      await mutate()
    }
  }

  async function newScrape() {
    try {
      await apiClient.api.v1.scrape.post()
      await mutate()
      toaster.create({
        title: 'Success',
        description: 'New scrape started.',
        type: 'success',
        duration: 5000,
        closable: true,
      })
    } catch (e) {
      console.error(e)
      toaster.create({
        title: 'Fail',
        description: 'Failed to create new scrape.',
        type: 'error',
        duration: 5000,
        closable: true,
      })
    }
  }

  return (
    <Container py={4}>
      <Heading mb={4}>Scraper</Heading>
      <ScrapeControls onRefresh={refresh} onNew={newScrape} />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : (
        <ScrapeList scrapes={scrapes} />
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
