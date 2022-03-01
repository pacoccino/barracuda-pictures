import { useContext } from 'react'
import { useQuery } from '@redwoodjs/web'
import { ArboDate, ArboPath } from 'api/types/graphql'

export const QUERY = gql`
  query APLU {
    arbo
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
  const apluQuery = useQuery(QUERY, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
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
