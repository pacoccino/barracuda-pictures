import type { Tag } from 'types/graphql'

import { Box, VStack } from '@chakra-ui/react'
import { useCallback } from 'react'
import { TagListGrouped, TagListFlat } from 'src/components/Tag/TagList/TagList'
import { useFilterContext } from 'src/contexts/filter'

const FilterPanel = ({ tagGroups }) => {
  const { selectedTags, setSelectedTags } = useFilterContext()

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
        <h2>Active filters</h2>
        <TagListFlat
          tags={selectedTags}
          onClick={(tag) => removeTagToFilter(tag)}
        />
        <h2>Tags</h2>
        <TagListGrouped
          tagGroups={tagGroups}
          onClick={(tag) => addTagToFilter(tag)}
        />
      </Box>
    </VStack>
  )
}

export default FilterPanel
