import {
  Box,
  Button,
  Flex,
  Center,
  VStack,
  Image as ImageChakra,
  Table,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  WrapItem,
  Wrap,
} from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { useEffect, useMemo, useState } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import ImageTagsModalCell from 'src/components/Tag/ImageTagsModalCell/ImageTagsModalCell'
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Link, routes, navigate } from '@redwoodjs/router'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'
import images from 'src/components/Image/Images/Images'

const Image = ({
  image,
  imagesBefore,
  imagesAfter,
}: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => getImageUrl(image), [image])
  const [editTagOpen, setEditTagOpen] = useState(false)

  useEffect(() => {
    function logKey(e) {
      switch (e.code) {
        case 'Escape':
          navigate(routes.photos())
          break
        case 'ArrowLeft':
          if (imagesBefore[0])
            navigate(routes.photo({ id: imagesBefore[0].id }))
          break
        case 'ArrowRight':
          if (imagesAfter[0]) navigate(routes.photo({ id: imagesAfter[0].id }))
          break
      }
    }
    document.addEventListener('keydown', logKey)
    return () => {
      document.removeEventListener('keydown', logKey)
    }
  })

  return (
    <Box position="relative" h="100vh" w="100vw">
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        overflowY="auto"
      >
        <Link to={routes.photos()} title={'Back to gallery'}>
          <Center
            position="absolute"
            top={0}
            left={0}
            width={100}
            height={100}
            opacity={0.01}
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
          >
            <Icon as={CloseIcon} color="white" boxSize={8} />
          </Center>
        </Link>

        {imagesBefore[0] && (
          <Link
            to={routes.photo({ id: imagesBefore[0].id })}
            title={'Previous image'}
          >
            <Center
              position="absolute"
              left={0}
              bottom={0}
              width={100}
              height={100}
              opacity={0.01}
              cursor="pointer"
              _hover={{ opacity: 0.7 }}
            >
              <Icon as={ChevronLeftIcon} color="white" boxSize={8} />
            </Center>
          </Link>
        )}

        {imagesAfter[0] && (
          <Link
            to={routes.photo({ id: imagesAfter[0].id })}
            title={'Next image'}
          >
            <Center
              position="absolute"
              right={0}
              bottom={0}
              width={100}
              height={100}
              opacity={0.01}
              cursor="pointer"
              _hover={{ opacity: 0.7 }}
            >
              <Icon as={ChevronRightIcon} color="white" boxSize={8} />
            </Center>
          </Link>
        )}

        <Flex h="100%" justify="center" align="center" bg="black">
          <ImageChakra
            objectFit="contain"
            src={imageUrl}
            alt={image.path}
            h="100%"
          />
        </Flex>
        <Table size="md" w="100%">
          <TableCaption placement="top">Details</TableCaption>
          <Tbody>
            <Tr>
              <Th>Id</Th>
              <Td>{image.id}</Td>
            </Tr>
            <Tr>
              <Th>Path</Th>
              <Td>{image.path}</Td>
            </Tr>
            <Tr>
              <Th>Date taken</Th>
              <Td>{image.dateTaken}</Td>
            </Tr>
            <Tr>
              <Th>Location</Th>
              <Td>
                {image.takenAtLat && image.takenAtLat ? (
                  <Box>
                    <p>
                      <b>Lat:</b> {image.takenAtLat}
                    </p>
                    <p>
                      <b>Lng:</b> {image.takenAtLng}
                    </p>
                  </Box>
                ) : (
                  'Unknonwn'
                )}
              </Td>
            </Tr>
            <Tr>
              <Th>Tags</Th>
              <Td>
                <VStack>
                  <Wrap>
                    {image.tagsOnImages
                      .map((ti) => ti.tag)
                      .map((tag) => (
                        <WrapItem key={tag.id}>
                          <TagItemWithGroup tag={tag} />
                        </WrapItem>
                      ))}
                  </Wrap>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => setEditTagOpen(true)}
                  >
                    Edit
                  </Button>
                </VStack>
                <ImageTagsModalCell
                  imageId={image.id}
                  isOpen={editTagOpen}
                  onClose={() => setEditTagOpen(false)}
                />
              </Td>
            </Tr>
            <Tr>
              <Th>Metadata</Th>
              <Td>
                <Text as="kbd" wordBreak="break-all" fontSize="xs">
                  {JSON.stringify(image.metadata)}
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default Image
