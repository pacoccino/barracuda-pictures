import { Button, Input, useToast, BodyModal, Box } from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagCategoryItem } from 'src/components/Tag/TagItem/TagItem'
import { Flex } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'
import { useForm } from 'react-hook-form'

const CREATE_TAG = gql`
  mutation CreateTag($name: String!, $tagCategoryId: String!) {
    createTag(input: { name: $name, tagCategoryId: $tagCategoryId }) {
      id
      name
      tagCategoryId
      __typename
    }
  }
`
export const CreateTagModal = ({ tagCategory, onClose }) => {
  const createTagMutation = useMutation(CREATE_TAG)
  const initialRef = useRef(null)
  const toast = useToast()

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      tagName: '',
    },
  })
  useEffect(() => {
    reset({
      tagName: '',
    })
  }, [tagCategory, reset])
  const { ref: registerRef, ...registerRest } = register('tagName')

  const [createTag, { loading }] = createTagMutation
  const handleCreateTag = ({ tagName }) =>
    createTag({
      variables: { name: tagName, tagCategoryId: tagCategory.id },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Tag created completed',
          description: `${tagCategory.name} / ${tagName}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error creating tag',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <BodyModal
      isOpen={!!tagCategory}
      initialFocusRef={initialRef}
      onClose={!loading && onClose}
      title="Create Tag"
    >
      <Box mb={2}>
        <TagCategoryItem tagCategory={tagCategory} />
      </Box>
      <form onSubmit={handleSubmit(handleCreateTag)}>
        <Input
          type="text"
          placeholder="Tag name"
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
            colorScheme="blue"
          >
            Create
          </Button>
        </Flex>
      </form>
    </BodyModal>
  )
}
