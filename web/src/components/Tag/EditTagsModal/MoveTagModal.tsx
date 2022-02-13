import { Button, Input, useToast, BodyModal, Box } from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel, Select } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/components/Tag/EditTagsModal/EditTagsModal'
import { useForm } from 'react-hook-form'
import { useTagContext } from 'src/contexts/tags'

const MOVE_TAG = gql`
  mutation MoveTag($tagGroupId: String!, $tagId: String!) {
    updateTag(id: $tagId, input: { tagGroupId: $tagGroupId }) {
      id
      name
      tagGroupId
      tagGroup {
        id
        name
      }
      __typename
    }
  }
`
export const MoveTagModal = ({ tag, onClose }) => {
  const updateTagMutation = useMutation(MOVE_TAG)
  const initialRef = useRef(null)
  const { tagsQuery } = useTagContext()
  const toast = useToast()

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      tagGroupId: '',
    },
  })
  useEffect(() => {
    if (tag) {
      reset({
        tagGroupId: tag.tagGroup.id,
      })
    }
  }, [reset, tag])

  const [updateTag, { loading }] = updateTagMutation
  const handleUpdateTag = ({ tagGroupId }) =>
    updateTag({
      variables: { tagGroupId: tagGroupId, tagId: tag.id },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then((res) => {
        toast({
          title: 'Tag moved',
          description: `${res.data.updateTag.tagGroup.name} / ${tag.name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error moving tag',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <BodyModal
      isOpen={loading || !!tag}
      onClose={onClose}
      initialFocusRef={initialRef}
      title="Edit Tag"
    >
      <Box mb={2}>
        <TagItemWithGroup tag={tag} />
      </Box>
      <form onSubmit={handleSubmit(handleUpdateTag)}>
        <FormLabel>Tag Group:</FormLabel>
        <Select {...register('tagGroupId')}>
          {tagsQuery.data?.tagGroups?.map((tg) => (
            <option key={tg.id} value={tg.id}>
              {tg.name}
            </option>
          ))}
        </Select>
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
            Move
          </Button>
        </Flex>
      </form>
    </BodyModal>
  )
}
