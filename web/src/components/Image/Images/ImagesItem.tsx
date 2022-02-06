import { Link, routes } from '@redwoodjs/router'
import { getImageUrl } from 'src/lib/static'
import { Icon, Box, Image } from '@chakra-ui/react'

import { FindImages } from 'types/graphql'
import { SelectMode, useSelectContext } from 'src/contexts/select'
import { useMemo } from 'react'
import { MdRadioButtonUnchecked, MdCheckCircle } from 'react-icons/md'

type ImagesItemProps = {
  image: FindImages['images'][number]
}

export const ImagesItem = ({ image }: ImagesItemProps) => {
  const {
    selectMode,
    addImageToSelection,
    removeImageFromSelection,
    isImageSelected,
  } = useSelectContext()

  const imageComponent = (
    <Image src={getImageUrl(image)} alt={image.path} h={250} />
  )
  const imageSelected = useMemo(
    () => isImageSelected(image),
    [image, isImageSelected]
  )

  if (selectMode === SelectMode.VIEW) {
    return (
      <Link
        to={routes.photo({ id: image.id })}
        title={'Show image ' + image.id + ' detail'}
      >
        {imageComponent}
      </Link>
    )
  } else if (selectMode === SelectMode.MULTI_SELECT) {
    return (
      <Box
        cursor="pointer"
        position="relative"
        onClick={
          imageSelected
            ? () => removeImageFromSelection(image)
            : () => addImageToSelection(image)
        }
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          borderColor={imageSelected ? 'blue.500' : 'transparent'}
          borderWidth={3}
        >
          <Box position="absolute" top={2} right={2}>
            {imageSelected ? (
              <Icon as={MdCheckCircle} color="blue.300" />
            ) : (
              <Icon as={MdRadioButtonUnchecked} color="blue.300" />
            )}
          </Box>
        </Box>
        {imageComponent}
      </Box>
    )
  }
}
