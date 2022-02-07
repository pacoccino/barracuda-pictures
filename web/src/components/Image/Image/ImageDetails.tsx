import { Box, Flex, Text, WrapItem, Wrap } from 'src/design-system'
import { TagItemNew } from 'src/components/Tag/TagItem/TagItem'
import Decimal from 'decimal.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useClipboard,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { RightPanelOptions } from 'src/components/Image/Image/RightPanel'
import moment from 'moment'

type ParsedMetadata = {
  ISO?: number
  FocalLength?: number
  ExposureTime?: number
  ApertureValue?: number
  camera?: string
  lens?: string
  software?: string
}

const parseMetadata = (metadata?: any): ParsedMetadata => {
  if (!metadata) return
  const parsed: ParsedMetadata = {}

  const { exif, image } = metadata
  if (image) {
    if (hasSome(image, ['Model', 'Make'])) {
      parsed.camera = `${image.Make || ''}${
        hasAll(metadata.image, ['Model', 'Make']) ? ' - ' : ''
      }${image.Model || ''}`
    }
    if (image.Software) {
      parsed.software = image.Software
    }
  }

  if (exif) {
    if (hasSome(exif, ['LensMake', 'LensModel'])) {
      parsed.lens = `${exif.LensMake || ''}${
        hasAll(exif, ['LensMake', 'LensModel']) ? ' - ' : ''
      }${exif.LensModel || ''}`
    }

    if (exif.ISO) {
      parsed.ISO = new Decimal(exif.ISO).toDP(0).toNumber()
    }
    if (exif.FocalLength) {
      parsed.FocalLength = new Decimal(exif.FocalLength).toDP(2).toNumber()
    }
    if (exif.FocalLengthIn35mmFormat) {
      parsed.FocalLength = new Decimal(exif.FocalLengthIn35mmFormat)
        .toDP(2)
        .toNumber()
    }
    if (exif.ExposureTime) {
      if (exif.ExposureTime >= 1) {
        parsed.ExposureTime = new Decimal(exif.ExposureTime).toDP(2).toNumber()
      } else {
        parsed.ExposureTime = new Decimal(-1)
          .div(exif.ExposureTime)
          .toDP(2)
          .toNumber()
      }
    }
    if (exif.ApertureValue) {
      parsed.ApertureValue = new Decimal(exif.ApertureValue).toDP(2).toNumber()
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

const RowTitle = ({ children, rightItem = null }) => (
  <Flex mb={3} align="center">
    <Text flex={1} textStyle="h2">
      {children}
    </Text>
    {rightItem && <Box> {rightItem}</Box>}
  </Flex>
)
const RowSubTitle = ({ children }) => (
  <Text textStyle="h3" mb={1}>
    {children}
  </Text>
)

const RowContent = ({ children }) => (
  <Box mb={3} ml={1}>
    {children}
  </Box>
)
const RowSubContent = ({ children }) => <Text fontSize="sm">{children}</Text>

export const ImageDetails = ({ image, switchRightPanel }) => {
  const metadataDisclosure = useDisclosure()

  const parsedMetadata = useMemo(() => parseMetadata(image.metadata), [image])

  const gps = useMemo(() => `${image.takenAtLat}, ${image.takenAtLng}`, [image])
  const { hasCopied, onCopy } = useClipboard(gps)

  return (
    <Box>
      <RowTitle>ID</RowTitle>
      <RowContent>{image.id}</RowContent>

      <RowTitle>Path</RowTitle>
      <RowContent>{image.path}</RowContent>

      <RowTitle>Date taken</RowTitle>
      <RowContent>
        {moment(image.dateTaken).format('D/MM/YYYY h:mm:ss')}
      </RowContent>

      <RowTitle
        rightItem={
          <Button
            onClick={() => switchRightPanel(RightPanelOptions.EDIT_TAGS)}
            size="xs"
          >
            Edit
          </Button>
        }
      >
        Tags
      </RowTitle>
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

      <RowTitle
        rightItem={
          <Button {...metadataDisclosure.getButtonProps()} size="xs">
            Open
          </Button>
        }
      >
        Metadata
      </RowTitle>
      <RowContent>
        <Wrap spacing={4}>
          {parsedMetadata.camera && (
            <WrapItem>
              <Box>
                <RowSubTitle>Camera</RowSubTitle>
                <RowSubContent>{parsedMetadata.camera}</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.lens && (
            <WrapItem>
              <Box>
                <RowSubTitle>Lens</RowSubTitle>
                <RowSubContent>{parsedMetadata.lens}</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.ISO && (
            <WrapItem>
              <Box>
                <RowSubTitle>ISO</RowSubTitle>
                <RowSubContent>{parsedMetadata.ISO} ISO</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.ApertureValue && (
            <WrapItem>
              <Box>
                <RowSubTitle>Aperture</RowSubTitle>
                <RowSubContent>
                  <i>f</i>/{parsedMetadata.ApertureValue}
                </RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.FocalLength && (
            <WrapItem>
              <Box>
                <RowSubTitle>Focal Length</RowSubTitle>
                <RowSubContent>{parsedMetadata.FocalLength} mm</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.ExposureTime && (
            <WrapItem>
              <Box>
                <RowSubTitle>Exposure Time</RowSubTitle>

                <RowSubContent>
                  {parsedMetadata.ExposureTime < 0
                    ? `1/${-parsedMetadata.ExposureTime}`
                    : parsedMetadata.ExposureTime}
                  s
                </RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.software && (
            <WrapItem>
              <Box>
                <RowSubTitle>Software</RowSubTitle>

                <RowSubContent>{parsedMetadata.software}</RowSubContent>
              </Box>
            </WrapItem>
          )}
        </Wrap>
      </RowContent>

      {hasAll(image, ['takenAtLat', 'takenAtLng']) && (
        <>
          <RowTitle
            rightItem={
              <IconButton
                aria-label="copy"
                icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                size="xs"
                onClick={onCopy}
              />
            }
          >
            Location
          </RowTitle>
          <RowContent>
            <Wrap spacing={4}>
              <WrapItem>
                <Box>
                  <RowSubTitle>LAT</RowSubTitle>
                  <RowSubContent>{image.takenAtLat} </RowSubContent>
                </Box>
              </WrapItem>
              <WrapItem>
                <Box>
                  <RowSubTitle>LONG</RowSubTitle>
                  <RowSubContent>{image.takenAtLng}</RowSubContent>
                </Box>
              </WrapItem>
            </Wrap>

            {process.env.GMAPS_API_KEY && (
              <Box mt={1}>
                <iframe
                  title="location_map"
                  width="100%"
                  height="250"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GMAPS_API_KEY}&q=${image.takenAtLat}+${image.takenAtLng}`}
                  allowFullScreen
                />
              </Box>
            )}
          </RowContent>
        </>
      )}

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
    </Box>
  )
}
