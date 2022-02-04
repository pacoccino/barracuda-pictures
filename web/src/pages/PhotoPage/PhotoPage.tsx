import { MetaTags } from '@redwoodjs/web'
import ImageCell from 'src/components/Image/Image/ImageCell'
import { useFilterContext } from 'src/contexts/filter'
import { useCallback, useState } from 'react'
import { RightPanelOptions } from 'src/components/Image/Image/RightPanel'

type PhotoPageProps = {
  id: string
}

const PhotoPage = ({ id }: PhotoPageProps) => {
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

      <ImageCell
        id={id}
        filter={filter}
        rightPanel={rightPanel}
        switchRightPanel={switchRightPanel}
      />
    </>
  )
}

export default PhotoPage
