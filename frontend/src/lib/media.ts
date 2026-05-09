import { resolveBackendUrl } from './api'

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) {
    return ''
  }

  return resolveBackendUrl(url)
}

export function getSongStreamPath(songId: string): string {
  return `/songs/${songId}/stream`
}
