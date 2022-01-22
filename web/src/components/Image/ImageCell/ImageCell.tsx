import type { FindImageWithTagsById } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Image from 'src/components/Image/Image'

export const QUERY = gql`
  query FindImageWithTagsById($id: Int!) {
    image: image(id: $id) {
      id
      path
      dateTaken
      dateEdited
      metadataJson
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
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Image not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ image }: CellSuccessProps<FindImageWithTagsById>) => {
  return <Image image={image} />
}
