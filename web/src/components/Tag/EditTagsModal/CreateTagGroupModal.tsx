import { Button, Input, useToast, BodyModal } from 'src/design-system'

import { useState } from 'react'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { useMutation } from '@redwoodjs/web'
import { Flex } from '@chakra-ui/react'

const CREATE_TAG_GROUP = gql`
  mutation CreateTagGroup($name: String!) {
    createTagGroup(input: { name: $name }) {
      id
      name
      __typename
    }
  }
`
export const CreateTagGroupModal = ({ isOpen, onClose }) => {
  const createTagGroupMutation = useMutation(CREATE_TAG_GROUP)
  const [tagGroupName, setTagGroupName] = useState('')
  const toast = useToast()

  const [createTagGroup, { loading }] = createTagGroupMutation
  const handleCreateTagGroup = (name) =>
    createTagGroup({
      variables: { name },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error creating tag group',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag group created completed',
          description: name,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <BodyModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create tag group"
      body={
        <>
          <Input
            type="text"
            placeholder="Tag group name"
            onChange={(e) => setTagGroupName(e.target.value)}
          />
          <Flex justify="end" my={4}>
            <Button onClick={onClose} mr={2}>
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateTagGroup(tagGroupName)}
              isLoading={loading}
              variant="solid"
              colorScheme="blue"
            >
              Create
            </Button>
          </Flex>
        </>
      }
    />
  )
}
