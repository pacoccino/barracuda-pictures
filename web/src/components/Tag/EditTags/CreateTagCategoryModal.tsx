import { Button, Input, useToast, BodyModal } from 'src/design-system'

import { useEffect, useRef } from 'react'
import { useMutation } from '@redwoodjs/web'
import { Flex } from '@chakra-ui/react'
import { QUERIES_TO_REFETCH } from 'src/contexts/tags'
import { useForm } from 'react-hook-form'

const CREATE_TAG_GROUP = gql`
  mutation CreateTagCategory($name: String!) {
    createTagCategory(input: { name: $name }) {
      id
      name
      __typename
    }
  }
`
export const CreateTagCategoryModal = ({ isOpen, onClose }) => {
  const createTagCategoryMutation = useMutation(CREATE_TAG_GROUP)
  const initialRef = useRef(null)
  const toast = useToast()

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      tagCategoryName: '',
    },
  })
  useEffect(() => {
    reset({
      tagCategoryName: '',
    })
  }, [isOpen, reset])
  const { ref: registerRef, ...registerRest } = register('tagCategoryName')

  const [createTagCategory, { loading }] = createTagCategoryMutation
  const handleCreateTagCategory = ({ tagCategoryName }) =>
    createTagCategory({
      variables: { name: tagCategoryName },
      refetchQueries: QUERIES_TO_REFETCH,
    })
      .then(() => {
        toast({
          title: 'Category created',
          description: tagCategoryName,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      })
      .catch((error) => {
        toast({
          title: 'Error creating category',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })

  return (
    <BodyModal
      isOpen={loading || isOpen}
      initialFocusRef={initialRef}
      onClose={onClose}
      title="Create category"
    >
      <form onSubmit={handleSubmit(handleCreateTagCategory)}>
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
            colorScheme="blue"
          >
            Create
          </Button>
        </Flex>
      </form>
    </BodyModal>
  )
}
