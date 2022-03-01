import { Text, VStack } from '@chakra-ui/react'
import { PathPanel } from './PathPanel'
import { DatePanel } from './DatePanel'
import { TagsPanel, SelectedTagsPanel } from './TagsPanel'

const FilterPanel = () => {
  return (
    <VStack py={4} px={2} spacing={4} align="stretch" h="100%">
      <Text align="center">Filters</Text>

      <PathPanel />
      <DatePanel />
      <TagsPanel />
      <SelectedTagsPanel />
    </VStack>
  )
}

export default FilterPanel
