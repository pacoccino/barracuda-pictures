import { Box, Flex, Heading, IconButton } from 'src/design-system'
import ImageTagsModal from 'src/components/Tag/ImageTags/ImageTagsModal'
import { CloseIcon } from '@chakra-ui/icons'
import { ImageDetails } from 'src/components/Image/ImageDetails'
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
            <ImageTagsModal image={image} />
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
