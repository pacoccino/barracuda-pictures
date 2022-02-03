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
  Fade,
  Wrap,
} from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { useEffect, useMemo, useState } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import ImageTagsModalCell from 'src/components/Tag/ImageTagsModal/ImageTagsModalCell'
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Link, routes, navigate } from '@redwoodjs/router'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'

const ImageDetails = ({ image }) => {
  const [editTagOpen, setEditTagOpen] = useState(false)

  return (
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
                  <b>Lat:</b> {image.takenAtLat} <b>Lng:</b> {image.takenAtLng}
                </p>

                {process.env.GMAPS_API_KEY && (
                  <iframe
                    width="450"
                    height="250"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GMAPS_API_KEY}&q=${image.takenAtLat}+${image.takenAtLng}`}
                    allowFullScreen
                  />
                )}
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
  )
}

const Hud = ({ imagesAfter, imagesBefore }) => {
  const [hudVisible, setHUDVisible] = useState(false)

  useEffect(() => {
    let timeout

    function handleKeyDown(e) {
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
    function handleMouseMove() {
      setHUDVisible(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setHUDVisible(false), 3000)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  })

  return (
    <Fade in={hudVisible}>
      <Box position="absolute" top={0} bottom={0} left={0} right={0}>
        <Link to={routes.photos()} title={'Back to gallery'}>
          <Center
            position="absolute"
            top={0}
            left={0}
            width={100}
            height={100}
            opacity={0.7}
            cursor="pointer"
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
              opacity={0.7}
              cursor="pointer"
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
              opacity={0.7}
              cursor="pointer"
            >
              <Icon as={ChevronRightIcon} color="white" boxSize={8} />
            </Center>
          </Link>
        )}
      </Box>
    </Fade>
  )
}
const Image = ({
  image,
  imagesBefore,
  imagesAfter,
}: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => getImageUrl(image), [image])

  return (
    <Box>
      <Flex
        h="100vh"
        justify="center"
        align="center"
        bg="black"
        position="relative"
      >
        <ImageChakra
          objectFit="contain"
          src={imageUrl}
          alt={image.path}
          h="100%"
        />
        <Hud
          image={image}
          imagesBefore={imagesBefore}
          imagesAfter={imagesAfter}
        />
      </Flex>

      <ImageDetails image={image} />
    </Box>
  )
}

export default Image
