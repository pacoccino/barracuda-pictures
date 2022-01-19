import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { ChakraProvider } from '@chakra-ui/react'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <ChakraProvider>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <RedwoodApolloProvider>
          <Routes />
        </RedwoodApolloProvider>
      </RedwoodProvider>
    </ChakraProvider>
  </FatalErrorBoundary>
)

export default App
