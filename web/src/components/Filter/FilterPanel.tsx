import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { PathPanel } from './PathPanel'
import { DatePanel } from './DatePanel'
import { TagsPanel, SelectedTagsPanel } from './TagsPanel'
import { useFilterContext } from 'src/contexts/filter'

const FilterPanel = () => {
  const { clearFilter, isFilterActive } = useFilterContext()

  return (
    <VStack py={4} px={2} spacing={4} align="stretch" h="100%">
      <Flex>
        <Heading textStyle="h3" size="sm" mb={2} flex="1">
          Filters
        </Heading>
        <Button
          onClick={clearFilter}
          size="xs"
          bg={isFilterActive ? 'red.200' : undefined}
          disabled={!isFilterActive}
        >
          {isFilterActive ? 'Clear filters' : 'No active filters'}
        </Button>
      </Flex>

      <PathPanel />
      <DatePanel />
      <TagsPanel />
    </VStack>
  )
}

export default FilterPanel
