import {
  Button,
  useToast,
  BodyModal,
  Box,
  DefaultSpinner,
} from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagItem } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel, Select } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'
import { useForm } from 'react-hook-form'
import { useTagContext } from 'src/contexts/tags'

const MOVE_TAG = gql`
  mutation MoveTag($tagCategoryId: String!, $tagId: String!) {
    updateTag(id: $tagId, input: { tagCategoryId: $tagCategoryId }) {
      id
      name
      tagCategoryId
      tagCategory {
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
      tagCategoryId: '',
    },
  })
  useEffect(() => {
    if (tag) {
      reset({
        tagCategoryId: tag.tagCategory.id,
      })
    }
  }, [reset, tag])

  const [updateTag, { loading }] = updateTagMutation
  const handleUpdateTag = ({ tagCategoryId }) =>
    updateTag({
      variables: { tagCategoryId: tagCategoryId, tagId: tag.id },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then((res) => {
        toast({
          title: 'Tag moved',
          description: `${res.data.updateTag.tagCategory.name} / ${tag.name}`,
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
      title="Move tag to other group"
    >
      <Box mb={2}>
        <TagItem tag={tag} showGroup />
      </Box>
      {!tagsQuery.loading ? (
        <form onSubmit={handleSubmit(handleUpdateTag)}>
          <FormLabel>Category:</FormLabel>
          <Select {...register('tagCategoryId')}>
            {tagsQuery.data?.tagCategorys?.map((tg) => (
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
      ) : (
        <DefaultSpinner />
      )}
    </BodyModal>
  )
}
