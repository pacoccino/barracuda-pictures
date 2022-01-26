import { Link, routes, useMatch } from '@redwoodjs/router'
import { Box, Button, Flex, Heading, HStack } from '@chakra-ui/react'

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
    <Flex direction="column" height="100vh">
      <HStack
        justify="space-between"
        px={4}
        align="center"
        as="header"
        h={34}
        bg="blue.600"
        w="100%"
      >
        <Heading as="h4" size="md" textTransform="uppercase" color="white">
          Barracuda photos
        </Heading>
        <HStack as="nav">
          <CustomNavLink to={routes.home()} name="Home" />
          <CustomNavLink to={routes.photos()} name="Photos" />
          <CustomNavLink to={routes.admin()} name="Admin" />
        </HStack>
      </HStack>
      <Box as="main" flex="1">
        {children}
      </Box>
    </Flex>
  )
}

export default DashboardLayout
