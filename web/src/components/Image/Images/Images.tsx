import moment from 'moment'
import { Link, routes } from '@redwoodjs/router'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { getImageUrl } from 'src/lib/static'
import { Box, Heading, Image } from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'

import debounce from 'lodash.debounce'
import { FindImages } from 'types/graphql'

type ImagesProps = {
  images: FindImages['images']
  loadMore: () => void
}

const Images = ({ images, loadMore }: ImagesProps) => {
  // Split by Month _ Year
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

  // Infinite scroll load
  const scrollRef = useRef(null)
  useEffect(() => {
    const div = scrollRef.current
    const handleScroll = debounce(() => {
      if (div.scrollTop + div.offsetHeight >= div.scrollHeight) {
        loadMore()
      }
    }, 100)
    div.addEventListener('scroll', handleScroll)
    return () => {
      div.removeEventListener('scroll', handleScroll)
    }
  }, [loadMore])

  return (
    <Box
      ref={scrollRef}
      position="absolute"
      top={0}
      bottom={0}
      overflowY="auto"
      p={4}
    >
      {imageGroups.map((group) => (
        <Box key={group.title}>
          <Heading
            textStyle="h4"
            size="sm"
            mt={6}
            borderBottomColor="gray.300"
            borderBottomWidth={1}
          >
            {group.title}
          </Heading>
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
