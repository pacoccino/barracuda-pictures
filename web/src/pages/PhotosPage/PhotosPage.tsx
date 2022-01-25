import { MetaTags } from '@redwoodjs/web'
import ImagesCell from 'src/components/Image/ImagesCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import { HStack, Box } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>Photos</h1>

      <HStack>
        <Box w={200}>
          <FilterPanelCell />
        </Box>
        <Box>
          <ImagesCell filter={filter} />
        </Box>
      </HStack>
    </>
  )
}

export default PhotosPage
