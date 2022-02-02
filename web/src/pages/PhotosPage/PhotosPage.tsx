import { MetaTags } from '@redwoodjs/web'
import ImagesInfiniteCell from 'src/components/Image/Images/ImagesInfiniteCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import { Box, Flex } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  return (
    <Flex h="100%">
      <MetaTags title="Photos" description="Photos page" />
      <Box w={250}>
        <FilterPanelCell />
      </Box>
      <Box flex="1" position="relative">
        <ImagesInfiniteCell filter={filter} />
      </Box>
    </Flex>
  )
}

export default PhotosPage
