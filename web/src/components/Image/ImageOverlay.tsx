import { MetaTags } from '@redwoodjs/web'
import ImageCell from 'src/components/Image/ImageCell'
import { useFilterContext } from 'src/contexts/filter'
import { useCallback, useState } from 'react'
import { RightPanelOptions } from 'src/components/Image/RightPanel'
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'
import { routes, navigate } from '@redwoodjs/router'

type ImageOverlayProps = {
  photoId: string
}

const ImageOverlay = ({ photoId }: ImageOverlayProps) => {
  const { filter } = useFilterContext()

  const [rightPanel, setRightPanel] = useState<RightPanelOptions | null>(null)
  const switchRightPanel = useCallback(
    (rightPanelToToggle) => {
      if (rightPanelToToggle === null) setRightPanel(null)
      else if (rightPanel === rightPanelToToggle) setRightPanel(null)
      else setRightPanel(rightPanelToToggle)
    },
    [rightPanel]
  )

  return (
    <>
      <MetaTags title="Photo" description="Photo page" />

      <Modal
        onClose={() => navigate(routes.photos())}
        size="full"
        isOpen={!!photoId}
      >
        <ModalOverlay />
        <ModalContent>
          {photoId && (
            <ImageCell
              id={photoId}
              filter={filter}
              rightPanel={rightPanel}
              switchRightPanel={switchRightPanel}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageOverlay
