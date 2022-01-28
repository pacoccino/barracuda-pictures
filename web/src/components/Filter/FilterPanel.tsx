import type { Tag } from 'types/graphql'

import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useFilterContext } from 'src/contexts/filter'
import { TagStatus } from 'src/design-system/components/Tag'
import {
  TagGroupItem,
  TagItem,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'

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
        <VStack>
          {tagGroups.map((tagGroup) => (
            <Box key={tagGroup.id}>
              <TagGroupItem tagGroup={tagGroup} />
              <Wrap m={2}>
                {tagGroup.tags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <TagItem
                      tag={tag}
                      handleAction={() => addTagToFilter(tag)}
                      status={
                        selectedTags &&
                        selectedTags.find((t) => t.id === tag.id)
                          ? TagStatus.positive
                          : TagStatus.disabled
                      }
                      actionLabel="Add to filter"
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          ))}
        </VStack>
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
        <Wrap>
          {selectedTags.map((tag) => (
            <WrapItem key={tag.id}>
              <TagItemWithGroup
                tag={tag}
                actionLabel="Remove from filter"
                handleAction={() => removeTagToFilter(tag)}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  )
}

export default FilterPanel
