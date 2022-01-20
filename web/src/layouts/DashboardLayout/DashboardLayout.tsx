import { Link, routes } from '@redwoodjs/router'
import { Box, HStack } from '@chakra-ui/react'

type DashboardLayoutProps = {
  children?: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <header>
        <HStack justify="space-between" mx={4}>
          <Box>
            <h1>Photo app</h1>
          </Box>
          <Box>
            <nav>
              <HStack>
                <Link to={routes.home()}>Home</Link>
                <Link to={routes.photos()}>Photos</Link>
                <Link to={routes.admin()}>Admin</Link>
              </HStack>
            </nav>
          </Box>
        </HStack>
      </header>
      <main>{children}</main>
    </>
  )
}

export default DashboardLayout
