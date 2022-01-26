import { MetaTags } from '@redwoodjs/web'
import ImagesCell from 'src/components/Image/ImagesCell'
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
        <Box position="absolute" top={0} bottom={0} overflowY="auto">
          <ImagesCell filter={filter} />
        </Box>
      </Box>
    </Flex>
  )
}

export default PhotosPage
