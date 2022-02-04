import {
  Box,
  Flex,
  Table,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  WrapItem,
  Wrap,
} from 'src/design-system'
import {
  TagItemNew,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'

export const ImageDetails = ({ image }) => {
  const metadataDisclosure = useDisclosure()
  return (
    <Table size="xs" w="100%" fontSize="0.8rem">
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
                    title="location_map"
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
            <Flex>
              <Wrap flex="1">
                {image.tagsOnImages
                  .map((ti) => ti.tag)
                  .map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItemNew tag={tag} showGroup />
                    </WrapItem>
                  ))}
              </Wrap>
            </Flex>
          </Td>
        </Tr>
        <Tr>
          <Th>Metadata</Th>
          <Td>
            <Button {...metadataDisclosure.getButtonProps()} size="xs">
              Open
            </Button>
            <Modal
              isOpen={metadataDisclosure.isOpen}
              onClose={metadataDisclosure.onClose}
              scrollBehavior="inside"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Metadata</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box py={2}>
                    <Text fontFamily="monospace" fontSize="xs" whiteSpace="pre">
                      {JSON.stringify(image.metadata, null, 2)}
                    </Text>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
