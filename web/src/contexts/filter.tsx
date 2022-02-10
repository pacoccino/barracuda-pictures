import type {
  Tag,
  TagGroup,
  FilterByTagList,
  TagListCondition,
  DateRange,
} from 'types/graphql'
import { useContext, useMemo, useState, useCallback } from 'react'

interface FilterContextType {
  addTagToFilter: (t: Tag, tg: TagGroup) => void
  removeTagToFilter: (t: Tag, tg: TagGroup) => void
  clearFilter: () => void
  filter: {
    tagLists: FilterByTagList[]
    dateRange: DateRange | null
  }
  selectedTagIds: string[]
  tagListConditions: { [key: string]: TagListCondition }
  setTagListCondition: (s: string, c: TagListCondition) => void
  setDateRange: (d: DateRange | null) => void
}

export const FilterContext = React.createContext<FilterContextType>({
  addTagToFilter: () => 0,
  removeTagToFilter: () => 0,
  clearFilter: () => 0,
  filter: {
    tagLists: [],
    dateRange: null,
  },
  selectedTagIds: [],
  setTagListCondition: () => 0,
  tagListConditions: new Map(),
  setDateRange: () => 0,
})

export const FilterContextProvider = ({ children }) => {
  const [tagLists, setTagLists] = useState<FilterByTagList[]>([])
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  const filter = useMemo(() => {
    return {
      tagLists,
      dateRange,
    }
  }, [tagLists, dateRange])

  const selectedTagIds = useMemo(
    () => tagLists.reduce((acc, tagList) => acc.concat(tagList.tagIds), []),
    [tagLists]
  )
  const tagListConditions = useMemo(
    () =>
      tagLists.reduce(
        (acc, tagList) => ({
          ...acc,
          [tagList.tagGroupId]: tagList.condition,
        }),
        {}
      ),
    [tagLists]
  )

  const setTagListCondition = useCallback(
    (tagGroup: TagGroup, condition: TagListCondition) => {
      const tagListIndex = tagLists.findIndex(
        (tl) => tl.tagGroupId === tagGroup.id
      )
      if (tagListIndex !== -1) {
        const newTagLists = tagLists.slice()
        newTagLists[tagListIndex] = {
          ...newTagLists[tagListIndex],
          condition,
        }
        setTagLists(newTagLists)
      } else {
        setTagLists(
          tagLists.concat({
            tagGroupId: tagGroup.id,
            tagIds: [],
            condition,
          })
        )
      }
    },
    [tagLists]
  )

  const addTagToFilter = useCallback(
    (tag: Tag, tagGroup: TagGroup) => {
      const tagListIndex = tagLists.findIndex(
        (tl) => tl.tagGroupId === tagGroup.id
      )
      if (
        tagListIndex !== -1 &&
        tagLists[tagListIndex].tagIds.indexOf(tag.id) === -1
      ) {
        const newTagLists = tagLists.slice()
        newTagLists[tagListIndex] = {
          ...tagLists[tagListIndex],
          tagIds: tagLists[tagListIndex].tagIds.concat(tag.id),
        }
        setTagLists(newTagLists)
      } else {
        setTagLists(
          tagLists.concat({
            tagGroupId: tagGroup.id,
            tagIds: [tag.id],
            condition: 'OR',
          })
        )
      }
    },
    [tagLists]
  )
  const removeTagToFilter = useCallback(
    (tag: Tag, tagGroup: TagGroup) => {
      const tagListIndex = tagLists.findIndex(
        (tl) => tl.tagGroupId === tagGroup.id
      )
      if (tagListIndex !== -1) {
        const newTagLists = tagLists.slice()
        newTagLists[tagListIndex] = {
          ...tagLists[tagListIndex],
          tagIds: tagLists[tagListIndex].tagIds.filter((id) => id !== tag.id),
        }
        setTagLists(newTagLists)
      }
    },
    [tagLists]
  )

  const clearFilter = useCallback(() => {
    setTagLists([])
    setDateRange(null)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        selectedTagIds,
        tagListConditions,
        setTagListCondition,
        addTagToFilter,
        removeTagToFilter,
        filter,
        clearFilter,
        setDateRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)
