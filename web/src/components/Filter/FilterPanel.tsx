import type { Tag } from 'types/graphql'

import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
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
    <VStack py={4} px={2} align="start" bg="gray.100" w="100%" h="100%">
      <Heading as="h3" size="sm" mb={2}>
        Filters
      </Heading>
      <Flex justify="center" mb={4}>
        {selectedTags.length > 0 ? (
          <Box>
            <TagListFlat
              actionLabel="Remove from filter"
              tags={selectedTags}
              onClick={(tag) => removeTagToFilter(tag)}
            />
            <Button onClick={clearFilter} size="xs">
              Clear filters
            </Button>
          </Box>
        ) : (
          <Box bg="green.200" px={4} py={2} borderRadius={8}>
            <Text as="span" color="grey.500" fontSize="sm">
              No active filters
            </Text>
          </Box>
        )}
      </Flex>
      <Heading as="h3" size="sm" mb={2}>
        Tags
      </Heading>
      <TagListGrouped
        tagGroups={tagGroups}
        selectedTags={selectedTags}
        actionLabel="Add to filter"
        onClick={(tag) => addTagToFilter(tag)}
      />
    </VStack>
  )
}

export default FilterPanel
