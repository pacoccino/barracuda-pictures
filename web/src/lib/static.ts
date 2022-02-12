import type { FindImageById } from 'types/graphql'
import type { CellSuccessProps } from '@redwoodjs/web'

const PHOTOS_PREFIX = process.env['PHOTOS_URL']
const MINATURES_PREFIX = process.env['MINIATURES_URL']

export function getImageUrl(image: CellSuccessProps<FindImageById>['image']) {
  return `${PHOTOS_PREFIX}/${image.path}`
}
export function getMiniatureUrl(
  image: CellSuccessProps<FindImageById>['image']
) {
  return `${MINATURES_PREFIX}/${image.path}`
}
