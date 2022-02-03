import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { ChakraProvider } from '@chakra-ui/react'
import { chakraTheme } from './design-system'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

import './lib/locale'

import { FilterContextProvider } from 'src/contexts/filter'
import { TagContextProvider } from 'src/contexts/tags'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <ChakraProvider theme={chakraTheme}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <RedwoodApolloProvider>
          <FilterContextProvider>
            <TagContextProvider>
              <Routes />
            </TagContextProvider>
          </FilterContextProvider>
        </RedwoodApolloProvider>
      </RedwoodProvider>
    </ChakraProvider>
  </FatalErrorBoundary>
)

export default App
