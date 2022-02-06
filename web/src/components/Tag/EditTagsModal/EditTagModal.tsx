import { Button, Input, useToast, BodyModal, Box } from 'src/design-system'

import { useEffect, useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/components/Tag/EditTagsModal/EditTagsModal'

const UPDATE_TAG = gql`
  mutation UpdateTag($name: String!, $tagId: String!) {
    updateTag(id: $tagId, input: { name: $name }) {
      id
      name
      tagGroupId
      __typename
    }
  }
`
export const EditTagModal = ({ tag, onClose }) => {
  const updateTagMutation = useMutation(UPDATE_TAG)
  const [tagName, setTagName] = useState('')
  const toast = useToast()

  useEffect(() => {
    tag && setTagName(tag.name)
  }, [tag])

  const [updateTag, { loading }] = updateTagMutation
  const handleUpdateTag = (name) =>
    updateTag({
      variables: { name, tagId: tag.id },
      refetchQueries: QUERIES_TO_REFETCH,
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error editing tag',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag edited',
          description: `${tag.tagGroup.name} / ${name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <BodyModal isOpen={loading || !!tag} onClose={onClose} title="Edit Tag">
      <Box mb={2}>
        <TagItemWithGroup tag={tag} />
      </Box>
      <FormLabel>New name:</FormLabel>
      <Input
        type="text"
        placeholder="Tag name"
        onChange={(e) => setTagName(e.target.value)}
        value={tagName}
      />
      <Flex justify="end" my={4}>
        <Button onClick={onClose} mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() => handleUpdateTag(tagName)}
          isLoading={loading}
          variant="solid"
          colorScheme="yellow"
        >
          Edit
        </Button>
      </Flex>
    </BodyModal>
  )
}
