import { MetaTags } from '@redwoodjs/web'
import ImageCell from 'src/components/Image/ImageCell'
import { HStack } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'

type PhotoPageProps = {
  id: String
}

const PhotoPage = ({ id }: PhotoPageProps) => {
  return (
    <>
      <MetaTags title="Photo" description="Photo page" />

      <HStack justify="space-between">
        <h1>Photo</h1>
        <Link to={routes.photos()} title={'Back to gallery'}>
          Back to gallery
        </Link>
      </HStack>
      <ImageCell id={id} />
    </>
  )
}

export default PhotoPage
