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
  Heading,
} from 'src/design-system'
import { TagItemNew } from 'src/components/Tag/TagItem/TagItem'

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
import { useMemo } from 'react'

type ParsedMetadata = {
  ISO?: number
  FocalLength?: number
  ExposureTime?: number
  ApertureValue?: number
  camera?: number
  lens?: number
}

const parseMetadata = (metadata?: any): ParsedMetadata => {
  if (!metadata) return
  const parsed = {}

  const { exif, image } = metadata
  if (image) {
    if (hasSome(image, ['Model', 'Make'])) {
      parsed.camera = `${image.Make}${
        hasAll(metadata.image, ['Model', 'Make']) ? ' - ' : ''
      }${image.Model}`
    }
  }
  if (exif) {
    if (exif.ISO) {
      parsed.ISO = exif.ISO
    }

    if (hasSome(exif, ['LensMake', 'LensModel'])) {
      parsed.lens = `${exif.LensMake}${
        hasAll(exif, ['LensModel', 'LensModel']) ? ' - ' : ''
      }${exif.LensModel}`
    }

    if (exif.ISO) {
      parsed.ISO = exif.ISO
    }
    if (exif.FocalLength) {
      parsed.FocalLength = exif.FocalLength
    }
    if (exif.ExposureTime) {
      parsed.ExposureTime = exif.ExposureTime
    }
    if (exif.ApertureValue) {
      parsed.ApertureValue = exif.ApertureValue
    }
  }

  return parsed
}

function hasAll(obj: any, props: string[]) {
  return obj && props.reduce((acc, curr) => acc && !!obj[curr], true)
}
function hasSome(obj: any, props: string[]) {
  return obj && props.reduce((acc, curr) => acc || !!obj[curr], true)
}

const RowTitle = ({ children }) => (
  <Text textStyle="h2" mb={2}>
    {children}
  </Text>
)
const RowSubTitle = ({ children }) => (
  <Text textStyle="h3" mb={1}>
    {children}
  </Text>
)

const RowContent = ({ children }) => (
  <Text mb={3} ml={1}>
    {children}
  </Text>
)
const RowSubContent = ({ children }) => (
  <Text fontSize="sm" mb={1} ml={1}>
    {children}
  </Text>
)

export const ImageDetails = ({ image }) => {
  const metadataDisclosure = useDisclosure()

  const parsedMetadata = useMemo(() => parseMetadata(image.metadata), [image])

  return (
    <Box>
      <RowTitle>ID</RowTitle>
      <RowContent>{image.id}</RowContent>

      <RowTitle>Path</RowTitle>
      <RowContent>{image.path}</RowContent>

      <RowTitle>Date taken</RowTitle>
      <RowContent>{image.dateTaken}</RowContent>

      {image.takenAtLat &&
        image.takenAtLat(
          <>
            <RowTitle>Location</RowTitle>
            <RowContent>
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
            </RowContent>
          </>
        )}

      <RowTitle>Tags</RowTitle>
      <RowContent>
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
      </RowContent>

      {parsedMetadata && (
        <>
          <RowTitle>Camera settings</RowTitle>
          <RowContent>
            {parsedMetadata.camera && (
              <>
                <RowSubTitle>Camera</RowSubTitle>
                <RowSubContent>{parsedMetadata.camera}</RowSubContent>
              </>
            )}
            {parsedMetadata.lens && (
              <>
                <RowSubTitle>Lens</RowSubTitle>
                <RowSubContent>{parsedMetadata.lens}</RowSubContent>
              </>
            )}
            {parsedMetadata.ISO && (
              <>
                <RowSubTitle>ISO</RowSubTitle>
                <RowSubContent>{parsedMetadata.ISO} ISO</RowSubContent>
              </>
            )}
            {parsedMetadata.ApertureValue && (
              <>
                <RowSubTitle>Aperture</RowSubTitle>
                <RowSubContent>
                  <i>f</i>/{parsedMetadata.ApertureValue}
                </RowSubContent>
              </>
            )}
            {parsedMetadata.FocalLength && (
              <>
                <RowSubTitle>Focal Length</RowSubTitle>
                <RowSubContent>{parsedMetadata.FocalLength} mm</RowSubContent>
              </>
            )}
            {parsedMetadata.ExposureTime && (
              <>
                <RowSubTitle>Exposure Time</RowSubTitle>

                <RowSubContent>
                  {parsedMetadata.ExposureTime < 1
                    ? `1/${1 / parsedMetadata.ExposureTime}`
                    : parsedMetadata.ExposureTime}{' '}
                  s
                </RowSubContent>
              </>
            )}
          </RowContent>
        </>
      )}

      <RowTitle>Metadata</RowTitle>
      <RowContent>
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
      </RowContent>
    </Box>
  )
}
