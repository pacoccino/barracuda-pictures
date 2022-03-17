import { useFilterContext } from 'src/contexts/filter'
import { useTagContext } from 'src/contexts/tags'
import { useMemo } from 'react'
import { DefaultSpinner } from 'src/design-system'
import { FilterSection } from 'src/components/Filter/FilterSection'
import { APLUMode, useApluContext } from 'src/contexts/aplu'
import { TagsList } from './TagsList'

export const TagsPanel = () => {
  const { selectedTagIds, clearTags } = useFilterContext()

  return (
    <FilterSection
      title="Tags"
      active={selectedTagIds.length > 0}
      onClear={clearTags}
    >
      <AvailableTagsPanel />
    </FilterSection>
  )
}
const AvailableTagsPanel = () => {
  const { tagsQuery } = useTagContext()
  const { apluQuery, apluMode } = useApluContext()
  const { selectedTagIds } = useFilterContext()

  const filteredTagCategorys = useMemo(() => {
    if (tagsQuery.loading) return []
    if (apluMode === APLUMode.ALL) return tagsQuery.data.tagCategorys

    if (apluQuery.loading) return []

    return tagsQuery.data.tagCategorys
      .map((tagCategory) => {
        return {
          ...tagCategory,
          tags: tagCategory.tags.filter((tag) => {
            return (
              selectedTagIds.indexOf(tag.id) !== -1 ||
              apluQuery.data.attributesFromFilter.tags.findIndex(
                (t) => t.id === tag.id
              ) !== -1
            )
          }),
        }
      })
      .filter((tagCategory) => tagCategory.tags.length > 0)
  }, [selectedTagIds, apluQuery, tagsQuery])

  if (tagsQuery.loading) {
    return <DefaultSpinner />
  }

  return <TagsList tagCategorys={filteredTagCategorys} />
}
