import type { Tag } from 'types/graphql'

import {
  Box,
  Button,
  Flex,
  Heading,
  Switch,
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
import EditTagsModalCell from 'src/components/Tag/EditTagsModal/EditTagsModalCell'

const FilterPanel = ({ tagGroups }) => {
  const {
    selectedTagIds,
    setTagListCondition,
    tagListConditions,
    addTagToFilter,
    removeTagToFilter,
    clearFilter,
  } = useFilterContext()
  const [editTagOpen, setEditTagOpen] = useState(false)

  const tags = useMemo(
    () => tagGroups.reduce((acc, tagGroup) => acc.concat(tagGroup.tags), []),
    [tagGroups]
  )

  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.indexOf(tag.id) !== -1),
    [selectedTagIds, tagGroups]
  )

  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )

  return (
    <VStack py={4} px={2} align="start" h="100%">
      <Flex w="100%">
        <Heading textStyle="h3" size="sm" mb={2} flex="1">
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
              <Flex>
                <Box flex="1">
                  <TagGroupItem tagGroup={tagGroup} />
                </Box>
                <Box>
                  <Switch
                    isChecked={tagListConditions[tagGroup.id] === 'AND'}
                    onChange={() =>
                      setTagListCondition(
                        tagGroup,
                        tagListConditions[tagGroup.id] === 'AND' ? 'OR' : 'AND'
                      )
                    }
                  />
                  {tagListConditions[tagGroup.id] || 'OR'}
                </Box>
              </Flex>
              <Wrap m={2}>
                {tagGroup.tags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <TagItem
                      tag={tag}
                      onClick={
                        isTagSelected(tag)
                          ? () => removeTagToFilter(tag, tagGroup)
                          : () => addTagToFilter(tag, tagGroup)
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
        <Heading textStyle="h3" size="sm" mb={2} flex="1">
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
                onClick={() => removeTagToFilter(tag, tag.tagGroup)}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  )
}

export default FilterPanel
