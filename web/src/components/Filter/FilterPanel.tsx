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
import { useMemo, useCallback, useState } from 'react'
import { useFilterContext } from 'src/contexts/filter'
import { TagStatus } from 'src/design-system/components/Tag'
import {
  TagGroupItem,
  TagItem,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'
import EditTagsModalCell from 'src/components/Tag/EditTagsModalCell/EditTagsModalCell'

const FilterPanel = ({ tagGroups }) => {
  const { selectedTags, setSelectedTags, clearFilter } = useFilterContext()
  const [editTagOpen, setEditTagOpen] = useState(false)

  const selectedTagIds = useMemo(
    () => selectedTags.map((t) => t.id),
    [selectedTags]
  )
  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )
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
      <Flex w="100%">
        <Heading as="h3" size="sm" mb={2} flex="1">
          Tags
        </Heading>
        <Button
          onClick={() => setEditTagOpen(true)}
          size="xs"
          colorScheme="blue"
        >
          Edit tags
        </Button>
        <EditTagsModalCell
          isOpen={editTagOpen}
          onClose={() => setEditTagOpen(false)}
        />
      </Flex>
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
                      onClick={
                        isTagSelected(tag)
                          ? () => removeTagToFilter(tag)
                          : () => addTagToFilter(tag)
                      }
                      status={
                        isTagSelected(tag)
                          ? TagStatus.positive
                          : TagStatus.disabled
                      }
                      actionLabel={
                        isTagSelected(tag)
                          ? 'Remove from filter'
                          : 'Add to filter'
                      }
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
                onClick={() => removeTagToFilter(tag)}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  )
}

export default FilterPanel
