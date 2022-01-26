import type { FindImages } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Images from 'src/components/Image/Images'

export const QUERY = gql`
  query FindImages($filter: ImageFilters!) {
    imagesWithFilter(filter: $filter) {
      id
      path
      dateTaken
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">{'No images yet. '}</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ imagesWithFilter }: CellSuccessProps<FindImages>) => {
  return <Images images={imagesWithFilter} />
}
