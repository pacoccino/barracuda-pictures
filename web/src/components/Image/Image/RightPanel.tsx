import {
  Box,
  Flex,
  Center,
  Heading,
  IconButton,
  Image as ImageChakra,
  HorizontalCollapse,
} from 'src/design-system'
import { getImageUrl } from 'src/lib/static'
import { useCallback, useMemo, useState } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import ImageTagsModalCell from 'src/components/Tag/ImageTagsModal/ImageTagsModalCell'
import { CloseIcon } from '@chakra-ui/icons'
import { ImageDetails } from 'src/components/Image/Image/ImageDetails'
import { Hud } from 'src/components/Image/Image/HUD'
import { DefaultSpinner } from 'src/design-system'

export enum RightPanelOptions {
  DETAILS,
  EDIT_TAGS,
}

export const RightPanel = ({ image, rightPanel, switchRightPanel }) => {
  return (
    <Box
      bg="white"
      height="100%"
      boxShadow="inset 4px 0px 6px 0px rgba(0,0,0,0.6);"
    >
      <Flex boxShadow="md" py={2} align="center" px={4}>
        <Heading textStyle="h2" size="md" flex={1} ml={2}>
          {rightPanel === RightPanelOptions.EDIT_TAGS && 'Edit'}
          {rightPanel === RightPanelOptions.DETAILS && 'Details'}
        </Heading>

        <IconButton
          icon={<CloseIcon />}
          variant="ghost"
          boxSize={8}
          onClick={() => switchRightPanel(null)}
        />
      </Flex>
      {image ? (
        <Box py={2} px={4} mt={2}>
          {rightPanel === RightPanelOptions.EDIT_TAGS && (
            <ImageTagsModalCell imageId={image.id} />
          )}
          {rightPanel === RightPanelOptions.DETAILS && (
            <ImageDetails image={image} switchRightPanel={switchRightPanel} />
          )}
        </Box>
      ) : (
        <DefaultSpinner />
      )}
    </Box>
  )
}
