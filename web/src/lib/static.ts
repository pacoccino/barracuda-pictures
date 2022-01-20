import type { FindImageById } from 'types/graphql'

const static_server_url = process.env['STATIC_SERVER_URL']

export function getImageUrl(image: FindImageById) {
  return `${static_server_url}/${image.path}`
}
