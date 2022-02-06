import type { ImageAndTags } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import TagsModal from './ImageTagsModal'
import { useMutation } from '@redwoodjs/web'
import { DefaultSpinner } from 'src/design-system/components/DefaultSpinner'

export const QUERY = gql`
  query ImageAndTags($imageId: String!) {
    image: image(id: $imageId) {
      id
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
    tagGroups {
      id
      name
      tags {
        id
        name
        tagGroup {
          name
        }
      }
    }
  }
`

const ADD_TAG_ON_IMAGE = gql`
  mutation AddTagOnImage($input: TagsOnImageInput!) {
    createTagsOnImage(input: $input) {
      id
      imageId
      tagId
      __typename
    }
  }
`
const REMOVE_TAG_ON_IMAGE = gql`
  mutation RemoveTagOnImage($input: TagsOnImageInput!) {
    deleteTagsOnImage(input: $input) {
      id
    }
  }
`
export const Loading = () => <DefaultSpinner />

export const Empty = () => {
  return <div className="rw-text-center">{'No tags yet. '}</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

type TagsModalCellProps = {
  isOpen: boolean
  onClose?: () => void
}

export const Success = ({
  tagGroups,
  onClose,
  image,
}: CellSuccessProps<ImageAndTags> & TagsModalCellProps) => {
  const [createTagsOnImage] = useMutation(ADD_TAG_ON_IMAGE)
  const [deleteTagsOnImage] = useMutation(REMOVE_TAG_ON_IMAGE)

  const handleAddTagOnImage = (imageId, tagId) => {
    createTagsOnImage({
      variables: { input: { imageId, tagId } },
      refetchQueries: [QUERY, 'ImageAndTags'],
    })
  }
  const handleRemoveTagOnImage = (imageId, tagId) => {
    deleteTagsOnImage({
      variables: { input: { imageId, tagId } },
      refetchQueries: [QUERY, 'ImageAndTags'],
    })
  }

  return (
    <TagsModal
      tagGroups={tagGroups}
      onClose={onClose}
      image={image}
      handleAddTagOnImage={handleAddTagOnImage}
      handleRemoveTagOnImage={handleRemoveTagOnImage}
    />
  )
}
