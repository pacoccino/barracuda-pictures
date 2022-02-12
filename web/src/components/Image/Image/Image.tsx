import {
  Box,
  Flex,
  Center,
  Image as ImageChakra,
  HorizontalCollapse,
} from 'src/design-system'
import { getImageUrl, getMiniatureUrl } from 'src/lib/static'
import { useMemo } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import { RightPanel } from 'src/components/Image/Image/RightPanel'
import { Hud } from 'src/components/Image/Image/HUD'
import { DefaultSpinner } from 'src/design-system'

const Image = ({
  image,
  imagesBefore,
  imagesAfter,
  rightPanel,
  switchRightPanel,
}: CellSuccessProps<FindImageWithTagsById>) => {
  const imageUrl = useMemo(() => image && getImageUrl(image), [image])
  const miniatureUrl = useMemo(() => image && getMiniatureUrl(image), [image])

  return (
    <Box>
      <Flex h="100vh" justify="stretch" align="stretch">
        <Box flex="1" bg="black" position="relative">
          <Center position="absolute" top={0} bottom={0} left={0} right={0}>
            <ImageChakra
              objectFit="contain"
              src={miniatureUrl}
              alt={image?.path}
              h="100%"
            />
          </Center>

          <Center position="absolute" top={0} bottom={0} left={0} right={0}>
            <DefaultSpinner size="xl" color="gray.300" />
          </Center>

          <Center position="absolute" top={0} bottom={0} left={0} right={0}>
            <ImageChakra
              objectFit="contain"
              src={imageUrl}
              fallback={<Box />}
              alt={image?.path}
              h="100%"
            />
          </Center>

          <Hud
            imageUrl={imageUrl}
            imagesBefore={imagesBefore}
            imagesAfter={imagesAfter}
            switchRightPanel={switchRightPanel}
          />
        </Box>

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
