import { Box, Button, Input, useToast, BodyModal } from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagGroupItem } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/components/Tag/EditTagsModal/EditTagsModal'
import { useForm } from 'react-hook-form'

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
  const updateTagGroupMutation = useMutation(UPDATE_TAG_GROUP)
  const initialRef = useRef(null)
  const toast = useToast()

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      tagGroupName: '',
    },
  })
  useEffect(() => {
    if (tagGroup) {
      reset({
        tagGroupName: tagGroup.name,
      })
    }
  }, [tagGroup, reset])
  const { ref: registerRef, ...registerRest } = register('tagGroupName')

  const [updateTagGroup, { loading }] = updateTagGroupMutation
  const handleUpdateTagGroup = ({ tagGroupName }) =>
    updateTagGroup({
      variables: { tagGroupId: tagGroup.id, name: tagGroupName },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Tag group edited',
          description: tagGroupName,
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
      <form onSubmit={handleSubmit(handleUpdateTagGroup)}>
        <FormLabel>New name:</FormLabel>
        <Input
          type="text"
          placeholder="Tag group name"
          {...registerRest}
          ref={(e) => {
            registerRef(e)
            initialRef.current = e
          }}
        />
        <Flex justify="end" my={4}>
          <Button disabled={loading} onClick={onClose} mr={2}>
            Cancel
          </Button>
          <Button
            type="submit"
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
