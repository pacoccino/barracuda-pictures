import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { useMutation } from '@redwoodjs/web'

const DELETE_TAG = gql`
  mutation DeleteTag($tagId: String!) {
    deleteTag(id: $tagId)
  }
`
export const DeleteTagModal = ({ tag, onClose }) => {
  const [deleteTag, { loading }] = useMutation(DELETE_TAG)
  const toast = useToast()

  const handleDeleteTag = (tagId) =>
    deleteTag({
      variables: { tagId },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error deleting tag',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag deleted',
          description: `${tag.tagGroup.name} / ${tag.name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <AlertModal
      isOpen={!!tag}
      loading={loading}
      header={'Delete Tag'}
      body={
        <Box>
          <TagItemWithGroup tag={tag} />
          <Text>
            Are you sure? This will remove the tag from all images which
            contains it
          </Text>
        </Box>
      }
      acceptLabel={'Delete'}
      acceptColor="red"
      onAccept={() => handleDeleteTag(tag.id)}
      onCancel={onClose}
    />
  )
}