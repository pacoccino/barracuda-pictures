import { useFilterContext } from 'src/contexts/filter'
import { useTagContext } from 'src/contexts/tags'
import { useMemo, useState } from 'react'
import { DefaultSpinner } from 'src/design-system'
import { FilterSection } from 'src/components/Filter/FilterSection'
import { APLUMode, useApluContext } from 'src/contexts/aplu'
import { TagsList } from './TagsList'
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { MdClear, MdSearch } from 'react-icons/md'

export const TagsPanel = () => {
  const { selectedTagIds, clearTags } = useFilterContext()

  return (
    <FilterSection
      title="Tags"
      active={selectedTagIds.length > 0}
      onClear={clearTags}
      defaultIsOpen={true}
    >
      <TagsPanelInternal />
    </FilterSection>
  )
}

const TagsPanelInternal = () => {
  const { tagsQuery } = useTagContext()
  const { apluQuery, apluMode } = useApluContext()
  const { selectedTagIds } = useFilterContext()

  const [searchText, setSearchText] = useState<string>('')

  const filteredTagCategorys = useMemo(() => {
    if (tagsQuery.loading) return []
    if (apluMode === APLUMode.FILTER && apluQuery.loading) return []

    function filterTag(tag) {
      let keep = false

      if (apluMode === APLUMode.ALL) {
        keep = true
      } else {
        if (selectedTagIds.indexOf(tag.id) !== -1) keep = true
        if (
          apluQuery.data.attributesFromFilter.tags.findIndex(
            (t) => t.id === tag.id
          ) !== -1
        )
          keep = true
      }

      if (keep && searchText) {
        if (!tag.name.toLowerCase().includes(searchText.toLowerCase()))
          keep = false
      }

      return keep
    }

    return tagsQuery.data.tagCategorys
      .map((tagCategory) => {
        return {
          ...tagCategory,
          tags: tagCategory.tags.filter(filterTag),
        }
      })
      .filter((tagCategory) => APLUMode.ALL || tagCategory.tags.length > 0)
  }, [apluMode, selectedTagIds, apluQuery, tagsQuery, searchText])

  if (tagsQuery.loading) {
    return <DefaultSpinner />
  }

  return (
    <Box>
      <Flex px={2} mb={2}>
        <InputGroup>
          <Input
            placeholder="Search tags ..."
            type="text"
            onKeyDown={(e) => e.code === 'Escape' && setSearchText('')}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <InputRightElement>
            {searchText.length > 0 ? (
              <IconButton
                aria-label="clear"
                variant="ghost"
                icon={<MdClear size={16} />}
                size="sm"
                onClick={() => setSearchText('')}
              />
            ) : (
              <MdSearch />
            )}
          </InputRightElement>
        </InputGroup>
      </Flex>
      <TagsList tagCategorys={filteredTagCategorys} />
    </Box>
  )
}
