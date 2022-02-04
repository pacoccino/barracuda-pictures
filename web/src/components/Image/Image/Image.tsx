import {
  Box,
  Flex,
  Center,
  Image as ImageChakra,
  HorizontalCollapse,
} from 'src/design-system'
import { getImageUrl } from 'src/lib/static'
import { useMemo } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import { RightPanel } from 'src/components/Image/Image/RightPanel'
import { Hud } from 'src/components/Image/Image/HUD'
import { DefaultSpinner } from 'src/design-system/components/DefaultSpinner'

const Image = ({
  image,
  imagesBefore,
  imagesAfter,
  rightPanel,
  switchRightPanel,
}: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => image && getImageUrl(image), [image])

  return (
    <Box>
      <Flex h="100vh" justify="stretch" align="stretch">
        <Center flex="1" bg="black" position="relative">
          {image ? (
            <ImageChakra
              objectFit="contain"
              src={imageUrl}
              alt={image.path}
              h="100%"
            />
          ) : (
            <DefaultSpinner size="xl" color="gray.500" />
          )}

          <Hud
            image={image}
            imagesBefore={imagesBefore}
            imagesAfter={imagesAfter}
            rightPanel={rightPanel}
            switchRightPanel={switchRightPanel}
          />
        </Center>

        <HorizontalCollapse isOpen={rightPanel !== null} width={400}>
          <RightPanel
            image={image}
            rightPanel={rightPanel}
            switchRightPanel={switchRightPanel}
          />
        </HorizontalCollapse>
      </Flex>
    </Box>
  )
}

export default Image
