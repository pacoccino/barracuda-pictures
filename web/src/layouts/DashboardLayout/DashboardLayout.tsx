import { Link, routes, useMatch } from '@redwoodjs/router'
import { Box, IconButton, Text, Flex, Heading, HStack } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'

type DashboardLayoutProps = {
  children?: React.ReactNode
}
/*
const CustomNavLink = ({ to, name }) => {
  const matchInfo = useMatch(to)
  return (
    <Link to={to}>
      <Button size="xs" bg={matchInfo.match ? 'blue.200' : undefined}>
        {name}
      </Button>
    </Link>
  )
}
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Flex direction="column" height="100vh">
      <HStack
        justify="space-between"
        px={4}
        align="center"
        as="header"
        h={34}
        w="100%"
        boxShadow="md"
      >
        <Link to={routes.photos()}>
          <Heading
            as="h2"
            textStyle="appTitle"
            size="md"
            textTransform="uppercase"
          >
            🖼 Barracuda
          </Heading>
        </Link>
        <HStack as="nav">
          <Link to={routes.admin()}>
            <IconButton
              aria-label="Settings"
              icon={<SettingsIcon />}
              size="xs"
            />
          </Link>
        </HStack>
      </HStack>
      <Box as="main" flex="1" overflow="hidden">
        {children}
      </Box>
    </Flex>
  )
}

export default DashboardLayout
