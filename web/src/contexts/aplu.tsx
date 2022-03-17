import { useCallback, useContext, useState } from 'react'
import { useQuery } from '@redwoodjs/web'
import { ArboResponse } from 'types/graphql'
import { useFilterContext } from 'src/contexts/filter'

export const QUERY = gql`
  query APLU($filter: ImageFilters) {
    attributesFromFilter(filter: $filter)
  }
`

export const QUERIES_TO_REFETCH = ['APLU']

export enum APLUMode {
  ALL = 'ALL',
  FILTER = 'FILTER',
}

interface ApluContextType {
  apluQuery: QueryOperationResult<ArboResponse> | { loading: false; data: null }
  apluMode: APLUMode
  switchAPLUMode: () => void
}

export const ApluContext = React.createContext<ApluContextType>({
  apluQuery: { loading: false, data: null },
  apluMode: APLUMode.ALL,
  switchAPLUMode: () => 0,
})

export const ApluContextProvider = ({ children }) => {
  const [mode, setMode] = useState<APLUMode>(APLUMode.ALL)
  const { filter } = useFilterContext()

  const apluQuery = useQuery(QUERY, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      filter: mode === APLUMode.FILTER ? filter : {},
    },
  })

  const switchAPLUMode = useCallback(() => {
    setMode(mode === APLUMode.FILTER ? APLUMode.ALL : APLUMode.FILTER)
  }, [mode])

  return (
    <ApluContext.Provider
      value={{
        apluQuery,
        apluMode: mode,
        switchAPLUMode,
      }}
    >
      {children}
    </ApluContext.Provider>
  )
}

export const useApluContext = () => useContext(ApluContext)
