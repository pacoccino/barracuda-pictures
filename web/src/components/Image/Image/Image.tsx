import {
  Box,
  Flex,
  Center,
  Image as ImageChakra,
  HorizontalCollapse,
} from 'src/design-system'
import { getImageUrl } from 'src/lib/static'
import { useCallback, useMemo, useState } from 'react'
import { CellSuccessProps } from '@redwoodjs/web'
import { FindImageWithTagsById } from 'types/graphql'
import {
  RightPanel,
  RightPanelOptions,
} from 'src/components/Image/Image/RightPanel'
import { Hud } from 'src/components/Image/Image/HUD'

const Image = ({
  image,
  imagesBefore,
  imagesAfter,
}: CellSuccessProps<FindImageWithTagsById>) => {
  const [rightPanel, setRightPanel] = useState<RightPanelOptions | null>(null)

  const switchRightPanel = useCallback(
    (rightPanelToToggle) => {
      if (rightPanelToToggle === null) setRightPanel(null)
      else if (rightPanel === rightPanelToToggle) setRightPanel(null)
      else setRightPanel(rightPanelToToggle)
    },
    [rightPanel]
  )
  const imageUrl = useMemo(() => getImageUrl(image), [image])

  return (
    <Box>
      <Flex h="100vh" justify="stretch" align="stretch">
        <Center flex="1" bg="black" position="relative">
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
