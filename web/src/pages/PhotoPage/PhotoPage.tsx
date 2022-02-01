import { MetaTags } from '@redwoodjs/web'
import ImageCell from 'src/components/Image/ImageCell'
import { useFilterContext } from 'src/contexts/filter'

type PhotoPageProps = {
  id: string
}

const PhotoPage = ({ id }: PhotoPageProps) => {
  const { filter } = useFilterContext()

  return (
    <>
      <MetaTags title="Photo" description="Photo page" />

      <ImageCell id={id} filter={filter} />
    </>
  )
}

export default PhotoPage
