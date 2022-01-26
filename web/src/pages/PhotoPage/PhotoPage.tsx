import { MetaTags } from '@redwoodjs/web'
import ImageCell from 'src/components/Image/ImageCell'

type PhotoPageProps = {
  id: string
}

const PhotoPage = ({ id }: PhotoPageProps) => {
  return (
    <>
      <MetaTags title="Photo" description="Photo page" />

      <ImageCell id={id} />
    </>
  )
}

export default PhotoPage
