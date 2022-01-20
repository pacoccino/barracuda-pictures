import { Link, routes } from '@redwoodjs/router'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { Box, Image as ImageChakra } from '@chakra-ui/react'

const ImagesList = ({ images }) => {
  return (
    <Box>
      <Wrap m={2} spacing={0.5}>
        {images.map((image) => (
          <WrapItem key={image.id}>
            <Link
              to={routes.photo({ id: image.id })}
              title={'Show image ' + image.id + ' detail'}
            >
              <ImageChakra
                src={getImageUrl(image)}
                alt={image.path}
                fit="cover"
                h={120}
                w={120}
              />
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
}

export default ImagesList
