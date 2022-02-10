import { Box, Button, Input, useToast, BodyModal } from 'src/design-system'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagGroupItem } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/components/Tag/EditTagsModal/EditTagsModal'

const UPDATE_TAG_GROUP = gql`
  mutation UpdateTagGroup($name: String!, $tagGroupId: String!) {
    updateTagGroup(id: $tagGroupId, input: { name: $name }) {
      id
      name
      __typename
    }
  }
`
export const EditTagGroupModal = ({ tagGroup, onClose }) => {
  const updagteTagGroupMutation = useMutation(UPDATE_TAG_GROUP)
  const [tagGroupName, setTagGroupName] = useState('')
  const toast = useToast()
  const initialRef = useRef()

  useEffect(() => {
    tagGroup && setTagGroupName(tagGroup.name)
  }, [tagGroup])

  const [updateTagGroup, { loading }] = updagteTagGroupMutation
  const handleUpdateTagGroup = (name) =>
    updateTagGroup({
      variables: { tagGroupId: tagGroup.id, name },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Tag group edited',
          description: name,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error editing tag group',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <BodyModal
      isOpen={loading || !!tagGroup}
      onClose={onClose}
      initialFocusRef={initialRef}
      title="Edit tag group"
    >
      <Box mb={2}>
        <TagGroupItem tagGroup={tagGroup} />
      </Box>
      <form onSubmit={() => handleUpdateTagGroup(tagGroupName)}>
        <FormLabel>New name:</FormLabel>
        <Input
          type="text"
          placeholder="Tag group name"
          ref={initialRef}
          onChange={(e) => setTagGroupName(e.target.value)}
          value={tagGroupName}
        />
        <Flex justify="end" my={4}>
          <Button disabled={loading} onClick={onClose} mr={2}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateTagGroup(tagGroupName)}
            isLoading={loading}
            variant="solid"
            colorScheme="yellow"
          >
            Edit
          </Button>
        </Flex>
      </form>
    </BodyModal>
  )
}
