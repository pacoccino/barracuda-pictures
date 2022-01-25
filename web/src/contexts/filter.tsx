import type { Tag } from 'types/graphql'
import { useContext, useMemo, useState, useCallback } from 'react'

interface FilterContextType {
  selectedTags: Tag[]
  setSelectedTags: (tag) => void
  clearFilter: () => void
  filter: {
    tagIds: string[]
  }
}
export const FilterContext = React.createContext<FilterContextType>({
  selectedTags: [],
  setSelectedTags: () => {
    throw new Error('not_ready_getCurrency')
  },
  clearFilter: () => {
    throw new Error('not_ready_getCurrency')
  },
  filter: {
    tagIds: [],
  },
})

export const FilterContextProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const filter = useMemo(() => {
    return {
      tagIds: selectedTags.map((t) => t.id),
    }
  }, [selectedTags])

  const clearFilter = useCallback(() => {
    setSelectedTags([])
  }, [])

  return (
    <FilterContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
        filter,
        clearFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)
