import { MetaTags } from '@redwoodjs/web'
import ImagesInfiniteCell from 'src/components/Image/Images/ImagesInfiniteCell'
import FilterPanelCell from 'src/components/Filter/FilterPanelCell'
import { Box, Button, Flex, IconButton, useDisclosure } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { useMemo, useState } from 'react'
import { HorizontalCollapse } from 'src/design-system'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

const PhotosPage = () => {
  const { filter } = useFilterContext()
  const variables = useMemo(() => ({ filter }), [filter])
  const filterPanelDisclosure = useDisclosure({ defaultIsOpen: true })

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
        {/*
        <Box position="absolute" top={0} right={-100}>
            <Button size="xs" onClick={() => setFilterPanelOpen(false)}>
              Close
            </Button>
          </Box>
        */}

        <FilterPanelCell />
      </HorizontalCollapse>

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

      <Box flex="1" position="relative" py={4} pr={4}>
        <ImagesInfiniteCell variables={variables} />
      </Box>
    </Flex>
  )
}

export default PhotosPage
