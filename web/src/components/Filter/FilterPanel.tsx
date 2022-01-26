import type { Tag } from 'types/graphql'

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { TagListGrouped, TagListFlat } from 'src/components/Tag/TagList/TagList'
import { useFilterContext } from 'src/contexts/filter'
import { TagStatus } from 'src/design-system/components/Tag'

const FilterPanel = ({ tagGroups }) => {
  const { selectedTags, setSelectedTags, clearFilter } = useFilterContext()

  const addTagToFilter = useCallback(
    (tag: Tag) => {
      if (selectedTags.findIndex((t) => t.id === tag.id) === -1)
        setSelectedTags(selectedTags.concat(tag))
    },
    [selectedTags]
  )
  const removeTagToFilter = useCallback(
    (tag: Tag) => {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
    },
    [selectedTags]
  )

  return (
    <VStack py={4} px={2} align="start" bg="gray.100" h="100%">
      <Heading as="h3" size="sm" mb={2}>
        Tags
      </Heading>
      <Box flex="1">
        <TagListGrouped
          tagGroups={tagGroups}
          selectedTags={selectedTags}
          actionLabel="Add to filter"
          onClick={(tag) => addTagToFilter(tag)}
        />
      </Box>
      <Flex w="100%">
        <Heading as="h3" size="sm" mb={2} flex="1">
          Filters
        </Heading>
        <Button
          onClick={clearFilter}
          size="xs"
          bg="red.200"
          disabled={selectedTags.length === 0}
        >
          {selectedTags.length > 0 ? 'Clear filters' : 'No active filters'}
        </Button>
      </Flex>
      {selectedTags.length > 0 && (
        <TagListFlat
          actionLabel="Remove from filter"
          tags={selectedTags}
          onClick={(tag) => removeTagToFilter(tag)}
        />
      )}
    </VStack>
  )
}

export default FilterPanel
