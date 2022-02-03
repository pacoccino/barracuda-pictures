import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { TagGroupItem } from 'src/components/Tag/TagItem/TagItem'
import { useMutation } from '@redwoodjs/web'
import { QUERIES_TO_REFETCH } from 'src/components/Tag/EditTagsModal/EditTagsModal'

const DELETE_TAG_GROUP = gql`
  mutation DeleteTagGroup($tagGroupId: String!) {
    deleteTagGroup(id: $tagGroupId)
  }
`
export const DeleteTagGroupModal = ({ tagGroup, onClose }) => {
  const [deleteTagGroup, { loading }] = useMutation(DELETE_TAG_GROUP)
  const toast = useToast()

  const handleDeleteTagGroup = (tagGroupId) =>
    deleteTagGroup({
      variables: { tagGroupId },
      refetchQueries: QUERIES_TO_REFETCH,
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error deleting tag group',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag groud deleted',
          description: `${tagGroup.name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <AlertModal
      isOpen={loading || !!tagGroup}
      loading={loading}
      header={'Delete Tag Group'}
      body={
        <Box>
          <TagGroupItem tagGroup={tagGroup} />
          <Text mt={4}>
            Are you sure? This will remove all the tags that belongs to it
          </Text>
        </Box>
      }
      acceptLabel={'Delete'}
      acceptColor="red"
      onAccept={() => handleDeleteTagGroup(tagGroup.id)}
      onCancel={onClose}
    />
  )
}
