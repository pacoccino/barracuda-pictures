import { Box, Text, useToast, AlertModal } from 'src/design-system'

import { useMutation } from '@redwoodjs/web'
import { useSelectContext } from 'src/contexts/select'
import { useFilterContext } from 'src/contexts/filter'
import { useEffect } from 'react'

const DELETE_IMAGES = gql`
  mutation DeleteImages($imageIds: [String!]!) {
    deleteManyImages(imageIds: $imageIds) {
      count
    }
  }
`
const DELETE_IMAGES_FILTER = gql`
  mutation DeleteImagesFilter($filter: ImageFilters!) {
    deleteManyImagesWithFilter(filter: $filter) {
      count
    }
  }
`

export const DeleteImagesModal = ({ isOpen, onClose }) => {
  const [deleteManyImages, { loading: ldi }] = useMutation(DELETE_IMAGES)
  const [deleteManyImagesWithFilter, { loading: ldf }] =
    useMutation(DELETE_IMAGES_FILTER)
  const loading = ldi || ldf
  const toast = useToast()

  const { selectedImages, allSelected } = useSelectContext()
  const { filter } = useFilterContext()

  useEffect(() => {
    isOpen && !allSelected && selectedImages.length === 0 && onClose()
  }, [isOpen, selectedImages, allSelected, onClose])

  const handleDelete = () => {
    let promise
    if (allSelected) {
      promise = deleteManyImagesWithFilter({
        variables: { filter },
        refetchQueries: ['FindImages'],
      })
    } else {
      promise = deleteManyImages({
        variables: {
          imageIds: selectedImages.map((i) => i.id),
        },
        refetchQueries: ['FindImages'],
      })
    }

    promise
      .then((res) => {
        onClose()
        toast({
          title: 'Images deleted',
          description: `${
            res.data[
              allSelected ? 'deleteManyImagesWithFilter' : 'deleteManyImages'
            ].count
          } images have been removed`,
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
