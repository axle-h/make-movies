import { NextRequest, NextResponse } from 'next/server'

export async function proxyHandler(request: NextRequest): Promise<NextResponse> {
    const { nextUrl: requestUrl, headers: requestHeaders, ...proxyRequest } = request
    const proxyUrl = new URL(requestUrl)
    const apiUrl = new URL(process.env.API_URL || 'http://localhost:5000/')

    proxyUrl.protocol = apiUrl.protocol
    proxyUrl.host = apiUrl.host
    proxyUrl.port = apiUrl.port

    const headers = new Headers(requestHeaders)
    headers.delete('cookie')
    headers.delete('set-cookie')
    headers.delete('host')

    try {
        const body = request.body ? await request.arrayBuffer() : null
        const proxyInit: RequestInit = {
            method: request.method,
            headers,
            body,
            redirect: 'manual'
        }

        if (process.env.API_REQUEST_LOGGING === 'true') {
            console.log(`${request.method.toUpperCase()} ${proxyUrl}`)
        }

        const response = await fetch(proxyUrl, proxyInit)

        return new NextResponse(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch (error) {
        console.error('Error forwarding request:', error);
        return new NextResponse('Error forwarding request', { status: 500 });
    }
}