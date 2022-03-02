import { useContext } from 'react'
import { useQuery } from '@redwoodjs/web'
import { ArboDate, ArboPath } from 'api/types/graphql'
import { useFilterContext } from 'src/contexts/filter'

export const QUERY = gql`
  query APLU($filter: ImageFilters) {
    arbo(filter: $filter)
  }
`

export const QUERIES_TO_REFETCH = ['APLU']

interface ApluContextType {
  apluQuery: QueryOperationResult<{ arboPath: ArboPath; arboDate: ArboDate }>
}

export const ApluContext = React.createContext<ApluContextType>({
  apluQuery: { loading: false, data: null },
})

export const ApluContextProvider = ({ children }) => {
  const { filter } = useFilterContext()

  const apluQuery = useQuery(QUERY, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      filter,
    },
  })

  return (
    <ApluContext.Provider
      value={{
        apluQuery,
      }}
    >
      {children}
    </ApluContext.Provider>
  )
}

export const useApluContext = () => useContext(ApluContext)
