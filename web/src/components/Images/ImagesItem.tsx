import { Link, routes } from '@redwoodjs/router'
import { getMiniatureUrl } from 'src/lib/static'
import { Box, Center, Icon, IconButton, Image } from '@chakra-ui/react'

import { FindImages } from 'types/graphql'
import { SelectMode, useSelectContext } from 'src/contexts/select'
import { useCallback, useMemo } from 'react'
import {
  MdCheckCircle,
  MdMoreVert,
  MdRadioButtonUnchecked,
  MdSearch,
} from 'react-icons/md'
import { Menu, MenuButton, MenuItem, MenuList } from 'src/design-system'
import { useFilterContext } from 'src/contexts/filter'

type ImagesItemProps = {
  image: FindImages['images'][number]
}

const ItemMenu = ({ image }) => {
  const { setPath } = useFilterContext()

  const setPathFilter = useCallback(() => {
    const imagePath = image.path

    const filterPath = imagePath.split('/').slice(0, -1).join('/')
    setPath(filterPath)
  }, [image])

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MdMoreVert />}
        aria-label="Options"
        color="black"
        bg="white"
        variant="ghost"
        _hover={{ bg: 'gray.100' }}
        borderRadius="full"
        size="xs"
      />
      <MenuList>
        <MenuItem icon={<MdSearch />} onClick={setPathFilter}>
          Filter same path
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export const ImagesItem = ({ image }: ImagesItemProps) => {
  const {
    selectMode,
    setSelectMode,
    addImageToSelection,
    removeImageFromSelection,
    isImageSelected,
    allSelected,
  } = useSelectContext()

  const imageComponent = (
    <Image src={getMiniatureUrl(image)} alt={image.path} h={250} />
  )
  const imageSelected = useMemo(
    () => isImageSelected(image),
    [image, isImageSelected]
  )

  const toggleSelection = () => {
    if (allSelected) return
    setSelectMode(SelectMode.MULTI_SELECT)
    if (imageSelected) removeImageFromSelection(image)
    else addImageToSelection(image)
  }

  const selectComponent = imageSelected ? (
    <Icon
      as={MdCheckCircle}
      boxSize={6}
      color="#157ff7"
      bg="rgba(255,255,255,0.9)"
      borderRadius="full"
    />
  ) : (
    <Icon as={MdRadioButtonUnchecked} boxSize={6} color="#157ff7" />
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
        <Center
          position="absolute"
          top={0}
          left={0}
          opacity={0}
          boxSize={14}
          _hover={{
            opacity: 1,
          }}
        >
          <ItemMenu image={image} />
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
          borderColor={imageSelected ? '#157ff7' : 'transparent'}
          borderWidth={5}
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
