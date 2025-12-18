import express from 'express'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

import movies from './movies.json' with { type: 'json' }
import scrapes from './scrapes.json' with { type: 'json' }
import downloads from './downloads.json' with { type: 'json' }

movies.sort((a, b) => a.title.localeCompare(b.title))

const app = express()
app.use(cors())
const port = 5000

function paginated(data) {
  return {
    page: 1,
    limit: 10,
    count: data.length,
    data,
  }
}

app.get('/api/v1/movie', (req, res) => {
  const { search, page, limit } = req.query
  const pageNum = parseInt(page || '1', 10)
  const limitNum = parseInt(limit || '10', 10)

  const filtered = !!search
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
    : movies

  const startIndex = (pageNum - 1) * limitNum
  const endIndex = startIndex + limitNum
  const paginatedData = filtered.slice(startIndex, endIndex)

  res.json({
    page: pageNum,
    limit: limitNum,
    count: filtered.length,
    data: paginatedData,
  })
})

app.get('/api/v1/movie/:id', (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404)
    res.json({})
  }
})

app.get('/api/v1/movie/:id/image', (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id)
  if (movie) {
    res.redirect(`/movie-images/${req.params.id}.jpg`)
  } else {
    res.status(404)
  }
})

app.get('/movie-images/:id.jpg', (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id)
  if (movie) {
    res.sendFile(path.resolve('images', `${movie.imdbCode}.jpg`))
  } else {
    res.status(404)
  }
})

app.get('/api/v1/scrape', (req, res) => {
  res.json(paginated(scrapes))
})

app.post('/api/v1/scrape', (req, res) => {
  const scrape = {
    id: randomUUID(),
    startDate: new Date().toISOString(),
  }
  scrapes.unshift(scrape)
  res.json(scrape)
})

app.get('/api/v1/download', (req, res) => {
  res.json(paginated(downloads))
})

app.post('/api/v1/movie/:id/download', (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id)
  if (movie) {
    const transmissionId =
      Math.max(...downloads.map((x) => x.transmissionId)) + 1
    const download = {
      id: `transmission_${transmissionId}`,
      movieId: req.params.id,
      transmissionId,
      name: `${movie.title} (${movie.year})`,
      startDate: new Date().toISOString(),
      complete: false,
    }
    downloads.unshift(download)
    res.json(download)
  } else {
    res.status(404)
    res.json({})
  }
})

app
  .listen(port, () => {
    console.log(`Make Movies Mock API listening on port ${port}`)
  })
  .on('error', (err) => {
    console.error('Server error:', err)
  })

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})
