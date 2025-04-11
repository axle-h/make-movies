'use client';

import {
    ButtonGroup,
    Card,
    Center,
    Container,
} from "@chakra-ui/react";
import {ArrowBackIcon, DownloadIcon, LockIcon} from "@/components/icons";
import { useRouter } from 'next/navigation'
import {apiClient, useClient} from '@/client'
import {ErrorAlert, Loading, NotFound} from "@/components/alert";
import {Movie} from "@/client/models";
import {MovieCardBody, MovieImage} from "@/components/movies/movie";
import {Button} from "@/components/ui/button";
import {toaster} from "@/components/ui/toaster";
import {Tooltip} from "@/components/ui/tooltip";
import React from "react";

function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Card.Root flexDirection={{ base: 'column', md: 'row' }}
              overflow='auto'
              variant='subtle'
              mb={4}
              bg='transparent'
        >
            <Center>
                <MovieImage movie={movie} maxW={{ base: 200, sm: 300 }} />
            </Center>

            <MovieCardBody movie={movie} />
        </Card.Root>
    )
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const router = useRouter()
    const { data: movie, error, isLoading, mutate } = useClient({ api: 'get-movie', id })

    async function download() {
        try {
            await apiClient.api.v1.movie.byId(id).download.post();
            await mutate();
            toaster.create({
                title: 'Success',
                description: `Downloading ${movie?.title}.`,
                type: 'success',
                duration: 5000,
                closable: true,
            })
        } catch (e) {
            console.error(e);
            toaster.create({
                title: 'Fail',
                description: `Failed to download ${movie?.title}.`,
                type: 'error',
                duration: 5000,
                closable: true,
            })
        }
    }

    const inLibrary = movie?.inLibrary === true
    return (<Container py={4}>
        <ButtonGroup variant='outline' mb={4}>
            <Button variant='outline' onClick={router.back}>
                <ArrowBackIcon /> Back
            </Button>
            <Tooltip disabled={!inLibrary} content='Already downloaded'>
                <Button colorPalette='green'
                        loading={!movie}
                        disabled={inLibrary}
                        onClick={download}>
                    {inLibrary ? <LockIcon /> : <DownloadIcon />} Download
                </Button>
            </Tooltip>

        </ButtonGroup>

        {isLoading ? <Loading /> :
            error ? <ErrorAlert error={error} /> :
                !movie ? <NotFound entity='movie' id={id} /> :
                    <MovieCard movie={movie} />}
    </Container>)
}