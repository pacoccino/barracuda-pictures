import { Link, routes } from '@redwoodjs/router'
import { Box, IconButton, Flex, Heading, HStack } from '@chakra-ui/react'
import { InfoIcon, SettingsIcon } from '@chakra-ui/icons'
import { useAuth } from '@redwoodjs/auth'
import { MdLogout } from 'react-icons/md'

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
  const { currentUser, logOut } = useAuth()
  console.log(currentUser)
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
            fontWeight={300}
            textTransform="uppercase"
          >
            🖼 Barracuda
          </Heading>
        </Link>
        <HStack as="nav" spacing={2}>
          <Box>{currentUser.username}</Box>
          <IconButton
            aria-label="Infos"
            icon={<MdLogout />}
            size="xs"
            onClick={logOut}
          />
          <Link to={routes.infos()}>
            <IconButton aria-label="Infos" icon={<InfoIcon />} size="xs" />
          </Link>
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
