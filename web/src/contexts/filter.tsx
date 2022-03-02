import type {
  Tag,
  TagGroup,
  FilterByTagList,
  TagListCondition,
  DateRange,
  ImageFilters,
  FilterByRating,
} from 'types/graphql'
import { useContext, useMemo, useState, useCallback } from 'react'

interface FilterContextType {
  addTagToFilter: (t: Tag, tg: TagGroup) => void
  removeTagToFilter: (t: Tag, tg: TagGroup) => void
  clearTags: () => void
  clearFilter: () => void
  filter: ImageFilters
  selectedTagIds: string[]
  tagListConditions: { [key: string]: TagListCondition }
  setTagListCondition: (tg: TagGroup, c: TagListCondition) => void
  setDateRange: (d?: DateRange) => void
  setPath: (s?: string) => void
  setRating: (s?: FilterByRating) => void
  isFilterActive: boolean
}

export const FilterContext = React.createContext<FilterContextType>({
  addTagToFilter: () => 0,
  removeTagToFilter: () => 0,
  clearTags: () => 0,
  clearFilter: () => 0,
  filter: {
    tagLists: [],
    dateRange: null,
    path: null,
    rating: null,
  },
  selectedTagIds: [],
  setTagListCondition: () => 0,
  tagListConditions: new Map(),
  setDateRange: () => 0,
  setPath: () => 0,
  setRating: () => 0,
  isFilterActive: false,
})

export const FilterContextProvider = ({ children }) => {
  const [path, setPath] = useState<string | null>(null)
  const [tagLists, setTagLists] = useState<FilterByTagList[]>([])
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [rating, setRating] = useState<FilterByRating | null>(null)

  const filter = useMemo(() => {
    return {
      path,
      tagLists,
      dateRange,
      rating,
    }
  }, [tagLists, dateRange, path, rating])

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
    setPath(null)
    setTagLists([])
    setDateRange(null)
  }, [])
  const clearTags = useCallback(() => {
    setTagLists([])
  }, [])

  const isFilterActive = useMemo(() => {
    return filter.path || filter.tagLists.length || filter.dateRange
  }, [filter])

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
        clearTags,
        setDateRange,
        setPath,
        setRating,
        isFilterActive,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)
