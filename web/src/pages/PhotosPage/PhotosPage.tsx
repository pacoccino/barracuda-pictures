import { MetaTags } from '@redwoodjs/web'
import ImagesInfiniteCell from 'src/components/Image/Images/ImagesInfiniteCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import {
  Box,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { useMemo } from 'react'
import { HorizontalCollapse } from 'src/design-system'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { SelectBar } from 'src/components/Image/Images/SelectBar'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  const variables = useMemo(() => ({ filter }), [filter])
  const filterPanelDisclosure = useDisclosure({ defaultIsOpen: true })

  console.log(filter)
  return (
    <Flex h="100%">
      <MetaTags title="Photos" description="Photos page" />

      <HorizontalCollapse
        isOpen={filterPanelDisclosure.isOpen}
        width={300}
        borderRightWidth={1}
        boxShadow="lg"
        height="100%"
      >
        <FilterPanelCell />
      </HorizontalCollapse>

      <Flex flex="1">
        <VStack flex="1" align="stretch">
          <Flex flex={1} overflow="hidden">
            <Flex
              align="center"
              onClick={filterPanelDisclosure.onToggle}
              _hover={{
                bg: 'linear-gradient(90deg, rgb(0 0 0 / 34%) 0%, rgb(255 255 255 / 0%) 63%);',
              }}
              cursor="pointer"
              w={6}
              pl={1}
            >
              {filterPanelDisclosure.isOpen ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </Flex>
            <Box flex={1}>
              <ImagesInfiniteCell variables={variables} />
            </Box>
          </Flex>
          <SelectBar />
        </VStack>
      </Flex>
    </Flex>
  )
}

export default PhotosPage
