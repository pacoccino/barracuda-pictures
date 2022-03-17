import { navigate, routes } from '@redwoodjs/router'
import { getMiniatureUrl } from 'src/lib/static'
import { Box, Center, Icon, IconButton, Image } from '@chakra-ui/react'

import { FindImages } from 'types/graphql'
import { useSelectContext } from 'src/contexts/select'
import { useCallback, useMemo } from 'react'
import {
  MdCheckCircle,
  MdMoreVert,
  MdRadioButtonUnchecked,
  MdInfo,
  MdSearch,
} from 'react-icons/md'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
} from 'src/design-system'
import { useFilterContext } from 'src/contexts/filter'
import { formatDate } from 'src/lib/utils'
import { useDoubleClick } from 'src/hooks/doubleClick'

type ImagesItemProps = {
  image: FindImages['imagesInfinite'][number]
}

const ItemMenu = ({ image }) => {
  const { setPath } = useFilterContext()

  const setPathFilter = useCallback(() => {
    const imagePath = image.path

    const filterPath = imagePath.split('/').slice(0, -1).join('/')
    setPath(filterPath)
  }, [setPath, image])

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

const ItemDetails = ({ image }) => {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <IconButton
          color="black"
          bg="white"
          variant="ghost"
          _hover={{ bg: 'gray.100' }}
          icon={<MdInfo />}
          size="xs"
          aria-label="info"
        />
      </PopoverTrigger>
      <PopoverContent width="initial">
        <PopoverBody>
          <Table size="sm">
            <Tbody>
              <Tr>
                <Th>Id</Th>
                <Td className="enable-select-text">{image.id}</Td>
              </Tr>
              <Tr>
                <Th>Path</Th>
                <Td className="enable-select-text">{image.path}</Td>
              </Tr>
              <Tr>
                <Th>Date</Th>
                <Td className="enable-select-text">
                  {formatDate(image.dateTaken)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export const ImagesItem = ({ image }: ImagesItemProps) => {
  const {
    addImageToSelection,
    removeImageFromSelection,
    isImageSelected,
    allSelected,
  } = useSelectContext()

  const imageSelected = useMemo(
    () => isImageSelected(image),
    [image, isImageSelected]
  )

  const toggleSelection = useCallback(() => {
    if (allSelected) return
    if (imageSelected) removeImageFromSelection(image)
    else addImageToSelection(image)
  }, [
    allSelected,
    imageSelected,
    addImageToSelection,
    removeImageFromSelection,
    image,
  ])

  const openImage = useCallback(() => {
    navigate(routes.photo({ photoId: image.id }))
  }, [image])

  const { clickHandler } = useDoubleClick({
    onSingleClick: toggleSelection,
    onDoubleClick: openImage,
  })

  return (
    <Box position="relative">
      <Image src={getMiniatureUrl(image)} alt={image.path} h={250} />

      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        borderColor={imageSelected ? '#157ff7' : 'transparent'}
        borderWidth={5}
        cursor="pointer"
        onClick={clickHandler}
        className="my-box"
      >
        <Center position="absolute" top={0} right={0} boxSize={12}>
          {imageSelected ? (
            <Icon
              as={MdCheckCircle}
              boxSize={6}
              color="#157ff7"
              bg="rgba(255,255,255,0.9)"
              borderRadius="full"
            />
          ) : (
            <Icon
              as={MdRadioButtonUnchecked}
              boxSize={6}
              color="#157ff7"
              opacity={0}
              sx={{
                '.my-box:hover &': {
                  opacity: 1,
                },
              }}
            />
          )}
        </Center>

        {imageSelected && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            border="1px solid white"
          />
        )}

        <Center
          position="absolute"
          top={0}
          left={0}
          boxSize={14}
          opacity={0}
          sx={{
            '.my-box:hover &': {
              opacity: 1,
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ItemMenu image={image} />
        </Center>
        <Center
          position="absolute"
          bottom={0}
          left={0}
          boxSize={14}
          opacity={0}
          sx={{
            '.my-box:hover &': {
              opacity: 1,
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ItemDetails image={image} />
        </Center>
      </Box>
    </Box>
  )
}
