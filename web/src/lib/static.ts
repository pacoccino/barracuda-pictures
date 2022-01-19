import type { FindImageById } from 'types/graphql'

const static_server_url = 'http://localhost:8080'

export function getImageUrl(image: FindImageById) {
  return `${static_server_url}/${image.path}`
}
