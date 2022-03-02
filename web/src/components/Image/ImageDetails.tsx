import { Box, Flex, Text, WrapItem, Wrap } from 'src/design-system'
import { TagItem } from 'src/components/Tag/TagItem/TagItem'
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
import { RightPanelOptions } from 'src/components/Image/RightPanel'

import { parseMetadata_exifr } from 'src/lib/metadata_parser'
import { formatDate } from 'src/lib/utils'
import { Rating } from 'src/design-system/components/Rating'

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

  const parsedMetadata = useMemo(
    () => parseMetadata_exifr(image.metadata),
    [image]
  )

  const gps = useMemo(() => `${image.takenAtLat}, ${image.takenAtLng}`, [image])
  const { hasCopied, onCopy } = useClipboard(gps)

  return (
    <Box>
      <RowTitle rightItem={<Rating value={image.rating} />}>ID</RowTitle>
      <RowContent>{image.id}</RowContent>

      <RowTitle>Path</RowTitle>
      <RowContent>{image.path}</RowContent>

      <RowTitle>Date taken</RowTitle>
      <RowContent>{formatDate(image.dateTaken)}</RowContent>

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
                  <TagItem tag={tag} showGroup />
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
                <RowSubContent>{parsedMetadata.camera.full}</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.lens && (
            <WrapItem>
              <Box>
                <RowSubTitle>Lens</RowSubTitle>
                <RowSubContent>{parsedMetadata.lens.full}</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.settings?.ISO && (
            <WrapItem>
              <Box>
                <RowSubTitle>ISO</RowSubTitle>
                <RowSubContent>{parsedMetadata.settings.ISO} ISO</RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.settings?.ApertureValue && (
            <WrapItem>
              <Box>
                <RowSubTitle>Aperture</RowSubTitle>
                <RowSubContent>
                  <i>f</i>/{parsedMetadata.settings.ApertureValue}
                </RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.settings?.FocalLength && (
            <WrapItem>
              <Box>
                <RowSubTitle>Focal Length</RowSubTitle>
                <RowSubContent>
                  {parsedMetadata.settings?.FocalLength} mm
                </RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.settings?.ExposureTime && (
            <WrapItem>
              <Box>
                <RowSubTitle>Exposure Time</RowSubTitle>

                <RowSubContent>
                  {parsedMetadata.settings?.ExposureTime < 0
                    ? `1/${-parsedMetadata.settings?.ExposureTime}`
                    : parsedMetadata.settings?.ExposureTime}
                  s
                </RowSubContent>
              </Box>
            </WrapItem>
          )}
          {parsedMetadata.edition?.software && (
            <WrapItem>
              <Box>
                <RowSubTitle>Software</RowSubTitle>

                <RowSubContent>{parsedMetadata.edition.software}</RowSubContent>
              </Box>
            </WrapItem>
          )}
        </Wrap>
      </RowContent>

      {parsedMetadata.gps && (
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
                  <RowSubContent>{parsedMetadata.gps.lat} </RowSubContent>
                </Box>
              </WrapItem>
              <WrapItem>
                <Box>
                  <RowSubTitle>LONG</RowSubTitle>
                  <RowSubContent>{parsedMetadata.gps.lng}</RowSubContent>
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
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GMAPS_API_KEY}&q=${parsedMetadata.gps.lat}+${parsedMetadata.gps.lng}`}
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
