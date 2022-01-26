import { Link, routes, useMatch } from '@redwoodjs/router'
import { Box, Button, Heading, HStack } from '@chakra-ui/react'

type DashboardLayoutProps = {
  children?: React.ReactNode
}

const CustomNavLink = ({ to, name }) => {
  const matchInfo = useMatch(to)
  return (
    <Link to={to}>
      <Button size="xs" bg={matchInfo.match ? 'blue.400' : undefined}>
        {name}
      </Button>
    </Link>
  )
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <header>
        <Box h={34} bg="blue.600">
          <HStack justify="space-between" mx={4} align="center" h="100%">
            <Box>
              <Heading
                as="h4"
                size="md"
                textTransform="uppercase"
                color="white"
              >
                Barracuda photos
              </Heading>
            </Box>
            <Box>
              <nav>
                <HStack>
                  <CustomNavLink to={routes.home()} name="Home" />
                  <CustomNavLink to={routes.photos()} name="Photos" />
                  <CustomNavLink to={routes.admin()} name="Admin" />
                </HStack>
              </nav>
            </Box>
          </HStack>
        </Box>
      </header>
      <main>{children}</main>
    </>
  )
}

export default DashboardLayout
