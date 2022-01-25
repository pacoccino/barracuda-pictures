import type { Tag, TagGroup } from 'types/graphql'
import { useContext, useMemo, useState } from 'react'

interface FilterContextType {
  selectedTags: Tag[]
  setSelectedTags: (tag) => void
  filter: {
    tagIds: string[]
  }
}
export const FilterContext = React.createContext<FilterContextType>({
  selectedTags: [],
  setSelectedTags: () => {
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

  return (
    <FilterContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
        filter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)
