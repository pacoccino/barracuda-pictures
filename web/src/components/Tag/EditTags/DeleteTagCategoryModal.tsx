import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { TagCategoryItem } from 'src/components/Tag/TagItem/TagItem'
import { useMutation } from '@redwoodjs/web'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'

const DELETE_TAG_GROUP = gql`
  mutation DeleteTagCategory($tagCategoryId: String!) {
    deleteTagCategory(id: $tagCategoryId)
  }
`
export const DeleteTagCategoryModal = ({ tagCategory, onClose }) => {
  const [deleteTagCategory, { loading }] = useMutation(DELETE_TAG_GROUP)
  const toast = useToast()

  const handleDeleteTagCategory = (tagCategoryId) =>
    deleteTagCategory({
      variables: { tagCategoryId },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Tag groud deleted',
          description: `${tagCategory.name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error deleting category',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <AlertModal
      isOpen={loading || !!tagCategory}
      loading={loading}
      header={'Delete category'}
      body={
        <Box>
          <TagCategoryItem tagCategory={tagCategory} />
          <Text mt={4}>
            Are you sure? This will remove all the tags that belongs to it
          </Text>
        </Box>
      }
      acceptLabel={'Delete'}
      acceptColor="red"
      onAccept={() => handleDeleteTagCategory(tagCategory.id)}
      onCancel={onClose}
    />
  )
}
