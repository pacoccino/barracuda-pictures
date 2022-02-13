import { AuthProvider } from '@redwoodjs/auth'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { ChakraProvider } from '@chakra-ui/react'
import { chakraTheme } from './design-system'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

import './lib/locale'

import { graphQLClientConfig } from 'src/lib/apollo'
const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <ChakraProvider theme={chakraTheme}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <AuthProvider type="dbAuth">
          <RedwoodApolloProvider graphQLClientConfig={graphQLClientConfig}>
            <Routes />
          </RedwoodApolloProvider>
        </AuthProvider>
      </RedwoodProvider>
    </ChakraProvider>
  </FatalErrorBoundary>
)

export default App
