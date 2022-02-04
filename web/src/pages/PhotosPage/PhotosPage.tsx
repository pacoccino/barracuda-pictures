import { MetaTags } from '@redwoodjs/web'
import ImagesInfiniteCell from 'src/components/Image/Images/ImagesInfiniteCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import { Box, Flex } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { useMemo } from 'react'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  const variables = useMemo(() => ({ filter }), [filter])

  return (
    <Flex h="100%">
      <MetaTags title="Photos" description="Photos page" />
      <Box w={300} borderRightWidth={1} boxShadow="lg">
        <FilterPanelCell />
      </Box>
      <Box flex="1" position="relative">
        <ImagesInfiniteCell variables={variables} />
      </Box>
    </Flex>
  )
}

export default PhotosPage
