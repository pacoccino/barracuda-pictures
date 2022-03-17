import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { TagItem } from 'src/components/Tag/TagItem/TagItem'
import { useMutation } from '@redwoodjs/web'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'

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
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Tag deleted',
          description: `${tag.tagCategory.name} / ${tag.name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error deleting tag',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <AlertModal
      isOpen={loading || !!tag}
      loading={loading}
      header={'Delete Tag'}
      body={
        <Box>
          <TagItem tag={tag} showGroup />
          <Text mt={4}>
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
