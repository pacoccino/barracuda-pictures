import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { useMutation } from '@redwoodjs/web'
import { useSelectContext } from 'src/contexts/select'
import { useFilterContext } from 'src/contexts/filter'
import { useEffect } from 'react'
import { MutationeditImagesBasePathArgs } from 'api/types/graphql'

const DELETE_IMAGES = gql`
  mutation DeleteImages($select: ImagesSelect!) {
    deleteManyImages(select: $select) {
      count
    }
  }
`

export const DeleteImagesModal = ({ isOpen, onClose }) => {
  const [deleteManyImages, { loading }] = useMutation(DELETE_IMAGES)
  const toast = useToast()

  const { selectedImages, allSelected } = useSelectContext()
  const { filter } = useFilterContext()

  useEffect(() => {
    isOpen && !allSelected && selectedImages.length === 0 && onClose()
  }, [isOpen, selectedImages, allSelected, onClose])

  const handleDelete = () => {
    const select: MutationeditImagesBasePathArgs['select'] = {}
    if (allSelected) {
      select.filter = filter
    } else {
      select.imageIds = selectedImages.map((i) => i.id)
    }
    deleteManyImages({
      variables: {
        select,
      },
      refetchQueries: ['FindImages'],
    })
      .then((res) => {
        onClose()
        toast({
          title: 'Images deleted',
          description: `${res.data.deleteManyImages.count} images have been removed`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: 'Error deleting images',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      })
  }

  return (
    <AlertModal
      isOpen={loading || isOpen}
      loading={loading}
      header={'Delete images'}
      body={
        <Box>
          <Text mt={4}>Are you sure you want to delete these images ?</Text>
        </Box>
      }
      acceptLabel={'Delete'}
      acceptColor="red"
      onAccept={() => handleDelete()}
      onCancel={onClose}
    />
  )
}
