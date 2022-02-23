import { useToast, BodyModal, Input, Button } from 'src/design-system'

import { useMutation } from '@redwoodjs/web'
import { useSelectContext } from 'src/contexts/select'
import { useFilterContext } from 'src/contexts/filter'
import { useEffect, useRef } from 'react'
import { MutationeditImagesBasePathArgs } from 'api/types/graphql'
import { useForm } from 'react-hook-form'
import { Flex, FormLabel } from '@chakra-ui/react'

const EDIT_BASE_PATH = gql`
  mutation EditBasePath($input: EditImagesBasePath!) {
    editImagesBasePath(input: $input) {
      count
    }
  }
`

export const EditBasePathModal = ({ isOpen, onClose }) => {
  const [editImagesBasePath, { loading }] = useMutation(EDIT_BASE_PATH)
  const toast = useToast()
  const initialRef = useRef(null)

  const { selectedImages, allSelected } = useSelectContext()
  const { filter } = useFilterContext()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      basePath: '',
    },
  })

  const { ref: registerRef, ...registerRest } = register('basePath')

  useEffect(() => {
    isOpen && !allSelected && selectedImages.length === 0 && onClose()
  }, [isOpen, selectedImages, allSelected, onClose])

  const handleEditBasePath = ({ basePath }) => {
    const input: MutationeditImagesBasePathArgs['input'] = {
      basePath,
    }
    if (allSelected) {
      input.filter = filter
    } else {
      input.imageIds = selectedImages.map((i) => i.id)
    }

    editImagesBasePath({
      variables: {
        input,
      },
      refetchQueries: ['FindImages'],
    })
      .then((res) => {
        onClose()
        toast({
          title: 'Base path edited',
          description: `${res.data.editImagesBasePath.count} images have been edited`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: 'Error editing images',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
  }

  return (
    <BodyModal
      onClose={onClose}
      isOpen={loading || isOpen}
      loading={loading}
      initialFocusRef={initialRef}
      title={'Edit images base path'}
    >
      <form onSubmit={handleSubmit(handleEditBasePath)}>
        <FormLabel>Base Path:</FormLabel>
        <Input
          type="text"
          placeholder="some/folder/path"
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
