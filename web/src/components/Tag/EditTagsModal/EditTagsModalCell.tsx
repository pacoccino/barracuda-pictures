import type { ImageAndTags } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useMutation } from '@redwoodjs/web'
import EditTagsModal from './EditTagsModal'

export const QUERY = gql`
  query EditTags {
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

const CREATE_TAG = gql`
  mutation CreateTag($name: String!, $tagGroupId: String!) {
    createTag(input: { name: $name, tagGroupId: $tagGroupId }) {
      id
      name
      tagGroupId
      __typename
    }
  }
`
const DELETE_TAG = gql`
  mutation DeleteTag($tagId: String!) {
    deleteTag(id: $tagId)
  }
`

const CREATE_TAG_GROUP = gql`
  mutation CreateTagGroup($name: String!) {
    createTagGroup(input: { name: $name }) {
      id
      name
      __typename
    }
  }
`
const DELETE_TAG_GROUP = gql`
  mutation DeleteTagGroup($tagGroupId: String!) {
    deleteTagGroup(id: $tagGroupId)
  }
`
export const Loading = () => <div>Loading...</div>

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
  isOpen,
  onClose,
}: CellSuccessProps<ImageAndTags> & TagsModalCellProps) => {
  const createTagMutation = useMutation(CREATE_TAG)
  const [deleteTag] = useMutation(DELETE_TAG)
  const createTagGroupMutation = useMutation(CREATE_TAG_GROUP)
  const [deleteTagGroup] = useMutation(DELETE_TAG_GROUP)

  const handleCreateTag = (name, tagGroupId) =>
    createTag({
      variables: { name, tagGroupId },
      refetchQueries: [QUERY, 'EditTags'],
    }).then(console.log)

  const handleDeleteTag = (tagId) =>
    deleteTag({
      variables: { tagId },
      refetchQueries: [QUERY, 'EditTags'],
    })

  const handleDeleteTagGroup = (tagGroupId) =>
    deleteTagGroup({
      variables: { tagGroupId },
      refetchQueries: [QUERY, 'EditTags'],
    })

  return (
    <EditTagsModal
      tagGroups={tagGroups}
      isOpen={isOpen}
      onClose={onClose}
      createTagMutation={createTagMutation}
      handleDeleteTag={handleDeleteTag}
      createTagGroupMutation={createTagGroupMutation}
      handleDeleteTagGroup={handleDeleteTagGroup}
    />
  )
}
