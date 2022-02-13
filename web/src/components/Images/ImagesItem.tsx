import { Link, routes } from '@redwoodjs/router'
import { getMiniatureUrl } from 'src/lib/static'
import { Box, Center, Icon, Image } from '@chakra-ui/react'

import { FindImages } from 'types/graphql'
import { SelectMode, useSelectContext } from 'src/contexts/select'
import { useMemo } from 'react'
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'

type ImagesItemProps = {
  image: FindImages['images'][number]
}

export const ImagesItem = ({ image }: ImagesItemProps) => {
  const {
    selectMode,
    setSelectMode,
    addImageToSelection,
    removeImageFromSelection,
    isImageSelected,
  } = useSelectContext()

  const imageComponent = (
    <Image src={getMiniatureUrl(image)} alt={image.path} h={250} />
  )
  const imageSelected = useMemo(
    () => isImageSelected(image),
    [image, isImageSelected]
  )

  const toggleSelection = () => {
    setSelectMode(SelectMode.MULTI_SELECT)
    if (imageSelected) removeImageFromSelection(image)
    else addImageToSelection(image)
  }

  const selectComponent = imageSelected ? (
    <Icon as={MdCheckCircle} boxSize={6} color="blue.300" />
  ) : (
    <Icon as={MdRadioButtonUnchecked} boxSize={6} color="blue.300" />
  )

  if (selectMode === SelectMode.VIEW) {
    return (
      <Box position="relative">
        <Link
          to={routes.photo({ id: image.id })}
          title={'Show image ' + image.id + ' detail'}
        >
          {imageComponent}
        </Link>
        <Center
          position="absolute"
          top={0}
          right={0}
          opacity={0}
          boxSize={14}
          _hover={{
            opacity: 1,
          }}
          cursor="pointer"
          onClick={toggleSelection}
        >
          {selectComponent}
        </Center>
      </Box>
    )
  } else if (selectMode === SelectMode.MULTI_SELECT) {
    return (
      <Box position="relative">
        {imageComponent}
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          borderColor={imageSelected ? 'blue.500' : 'transparent'}
          borderWidth={4}
          cursor="pointer"
          onClick={toggleSelection}
        >
          <Center position="absolute" top={0} right={0} boxSize={12}>
            {selectComponent}
          </Center>
        </Box>
      </Box>
    )
  }
}
