import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { ChakraProvider } from '@chakra-ui/react'
import { chakraTheme } from './design-system'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'
import { FilterContextProvider } from 'src/contexts/filter'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <ChakraProvider theme={chakraTheme}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <RedwoodApolloProvider>
          <FilterContextProvider>
            <Routes />
          </FilterContextProvider>
        </RedwoodApolloProvider>
      </RedwoodProvider>
    </ChakraProvider>
  </FatalErrorBoundary>
)

export default App
