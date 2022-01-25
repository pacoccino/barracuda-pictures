import type { Tag } from 'types/graphql'

import { Box, Button, VStack } from '@chakra-ui/react'
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
    <VStack>
      <Box>
        {selectedTags.length > 0 ? (
          <Box>
            <h2>Active filters</h2>
            <TagListFlat
              actionLabel="Remove from filter"
              tags={selectedTags}
              onClick={(tag) => removeTagToFilter(tag)}
              status={TagStatus.positive}
            />
            <Button onClick={clearFilter}>Clear filter</Button>
          </Box>
        ) : (
          <h2>No active filters</h2>
        )}
        <h2>Tags</h2>
        <TagListGrouped
          tagGroups={tagGroups}
          selectedTags={selectedTags}
          actionLabel="Add to filter"
          onClick={(tag) => addTagToFilter(tag)}
        />
      </Box>
    </VStack>
  )
}

export default FilterPanel
