export { auth as middleware } from "@/auth"


export const config = {
    matcher: [
        // protect all /api routes except /api/auth
        '/api/((?!auth).+)',
        // these pages under /app/(secure) are protected by the layout also. this is just for completeness
        '/movie-images/:path*', '/downloads(.*)', '/movies(.*)', '/scraper(.*)'
    ],
}