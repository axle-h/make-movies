export async function proxyHandler(request: Request): Promise<Response> {
    const { url: requestUrl, headers: requestHeaders, ...proxyRequest } = request
    const url = new URL(requestUrl)
    const apiUrl = new URL(process.env.API_URL || 'http://localhost:5000/')

    url.protocol = apiUrl.protocol
    url.host = apiUrl.host
    url.port = apiUrl.port

    const headers = new Headers(requestHeaders)
    headers.delete('cookie')
    headers.delete('host')

    const proxyInit: RequestInit = { ...proxyRequest, headers, redirect: 'manual' }
    if (process.env.API_REQUEST_LOGGING === 'true') {
        console.log(url.toString(), proxyInit)
    }

    return await fetch(url.toString(), proxyInit)
}