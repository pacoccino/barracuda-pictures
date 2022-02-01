import moment from 'moment'
import { Link, routes } from '@redwoodjs/router'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { Box, Heading, Image } from '@chakra-ui/react'
import { useMemo } from 'react'

const Images = ({ images }) => {
  const imageGroups = useMemo(() => {
    const groups = []
    let currentYear = -1
    let currentMonth = -1

    images.forEach((image) => {
      const year = moment(image.dateTaken).year()
      const month = moment(image.dateTaken).month()
      if (year !== currentYear || month !== currentMonth) {
        groups.push({
          title: `${moment.months()[month]} ${year}`,
          images: [image],
        })
      } else groups[groups.length - 1].images.push(image)
      currentYear = year
      currentMonth = month
    })
    return groups
  }, [images])

  return (
    <Box>
      {imageGroups.map((group) => (
        <Box key={group.title}>
          <Heading as="h4">{group.title}</Heading>
          <Wrap m={2} ml={0} spacing={0.5}>
            {group.images.map((image) => (
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
      ))}
    </Box>
  )
}

export default Images
