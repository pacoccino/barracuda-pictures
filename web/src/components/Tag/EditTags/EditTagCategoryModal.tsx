import { Box, Button, Input, useToast, BodyModal } from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { TagCategoryItem } from 'src/components/Tag/TagItem/TagItem'
import { Flex, FormLabel } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'
import { useForm } from 'react-hook-form'

const UPDATE_TAG_GROUP = gql`
  mutation UpdateTagCategory($name: String!, $tagCategoryId: String!) {
    updateTagCategory(id: $tagCategoryId, input: { name: $name }) {
      id
      name
      __typename
    }
  }
`

export const EditTagCategoryModal = ({ tagCategory, onClose }) => {
  const updateTagCategoryMutation = useMutation(UPDATE_TAG_GROUP)
  const initialRef = useRef(null)
  const toast = useToast()

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      tagCategoryName: '',
    },
  })
  useEffect(() => {
    if (tagCategory) {
      reset({
        tagCategoryName: tagCategory.name,
      })
    }
  }, [tagCategory, reset])
  const { ref: registerRef, ...registerRest } = register('tagCategoryName')

  const [updateTagCategory, { loading }] = updateTagCategoryMutation
  const handleUpdateTagCategory = ({ tagCategoryName }) =>
    updateTagCategory({
      variables: { tagCategoryId: tagCategory.id, name: tagCategoryName },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Category edited',
          description: tagCategoryName,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error editing category',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <BodyModal
      isOpen={loading || !!tagCategory}
      onClose={onClose}
      initialFocusRef={initialRef}
      title="Edit category"
    >
      <Box mb={2}>
        <TagCategoryItem tagCategory={tagCategory} />
      </Box>
      <form onSubmit={handleSubmit(handleUpdateTagCategory)}>
        <FormLabel>New name:</FormLabel>
        <Input
          type="text"
          placeholder="Category name"
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
