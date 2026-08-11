import useSWR from 'swr'

export interface UserInfo {
  name: string
  givenName?: string | null
  familyName?: string | null
  email?: string | null
  roles: string[]
}

/**
 * The api gates index.html behind the same policy, so by the time this runs we are always
 * signed in. It is only a 401 once the session expires underneath us, which the request
 * adapter turns into a login redirect.
 */
export function useUser() {
  return useSWR<UserInfo>('/api/v1/me', async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GET ${url} failed with ${response.status}`)
    }
    return response.json()
  })
}

export function displayName(user?: UserInfo): string {
  if (!user) {
    return ''
  }
  const fullName = [user.givenName, user.familyName].filter(Boolean).join(' ')
  return fullName || user.name
}
