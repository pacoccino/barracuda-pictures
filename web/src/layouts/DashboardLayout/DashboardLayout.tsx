import { Link, routes, useMatch } from '@redwoodjs/router'
import {
  Box,
  IconButton,
  Button,
  Flex,
  Heading,
  HStack,
} from '@chakra-ui/react'
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
        bg="gray.700"
        w="100%"
      >
        <Link to={routes.photos()}>
          <Heading as="h4" size="md" textTransform="uppercase" color="white">
            Barracuda photos
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
      <Box as="main" flex="1">
        {children}
      </Box>
    </Flex>
  )
}

export default DashboardLayout
