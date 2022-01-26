import { Link, routes } from '@redwoodjs/router'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { Box, Image } from '@chakra-ui/react'

const Images = ({ images }) => {
  return (
    <Box>
      <Wrap m={2} ml={0} spacing={0.5}>
        {images.map((image) => (
          <WrapItem key={image.id}>
            <Link
              to={routes.photo({ id: image.id })}
              title={'Show image ' + image.id + ' detail'}
            >
              <Image src={getImageUrl(image)} alt={image.path} h={250} />
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
}

export default Images
