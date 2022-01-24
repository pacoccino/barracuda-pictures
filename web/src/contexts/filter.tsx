import type { Tag, TagGroup } from 'types/graphql'
import { useContext, useState } from 'react'

interface FilterContextType {
  selectedTags: Tag[]
  setSelectedTags: (tag) => void
}
export const FilterContext = React.createContext<FilterContextType>({
  selectedTags: [],
  setSelectedTags: () => {
    throw new Error('not_ready_getCurrency')
  },
})

export const FilterContextProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  return (
    <FilterContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)
