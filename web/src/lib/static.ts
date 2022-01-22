import type { FindImageById } from 'types/graphql'
import type { CellSuccessProps } from '@redwoodjs/web'

const static_server_url = process.env['STATIC_SERVER_URL']

export function getImageUrl(image: CellSuccessProps<FindImageById>['image']) {
  return `${static_server_url}/${image.path}`
}
