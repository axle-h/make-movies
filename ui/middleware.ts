export { auth as middleware } from "@/auth"

export const config = {

    matcher: ['/api/((?!auth).+)', '/movie-images/:path*', '/downloads(.*)', '/movies(.*)', '/scraper(.*)'],
}