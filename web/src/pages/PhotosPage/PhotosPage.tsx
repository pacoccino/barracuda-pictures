import { MetaTags } from '@redwoodjs/web'
import ImagesCell from 'src/components/Image/ImagesCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import { Box, Flex } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <Flex>
        <Box w={250}>
          <FilterPanelCell />
        </Box>
        <Box flex="1">
          <ImagesCell filter={filter} />
        </Box>
      </Flex>
    </>
  )
}

export default PhotosPage
