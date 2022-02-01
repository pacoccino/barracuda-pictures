import type { FindImageWithTagsById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Image from 'src/components/Image/Image'

export const QUERY = gql`
  query FindImageWithTagsById($id: String!, $filter: ImageFilters!) {
    image: image(id: $id) {
      id
      path
      dateTaken
      metadata
      takenAtLng
      takenAtLat
      tagsOnImages {
        id
        tag {
          id
          name
          tagGroup {
            id
            name
          }
        }
      }
    }
    imagesBefore: images(
      filter: $filter
      sorting: { dateTaken: desc }
      take: -1
      skip: 1
      cursor: $id
    ) {
      id
    }
    imagesAfter: images(
      filter: $filter
      sorting: { dateTaken: desc }
      take: 1
      skip: 1
      cursor: $id
    ) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Image not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({
  image,
  imagesBefore,
  imagesAfter,
}: CellSuccessProps<FindImageWithTagsById>) => {
  return (
    <Image
      image={image}
      imagesBefore={imagesBefore}
      imagesAfter={imagesAfter}
    />
  )
}
