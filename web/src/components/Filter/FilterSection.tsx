import { Center, Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { StatusIcon } from 'src/design-system'

interface FilterSectionProps {
  children: React.ReactNode
  title: string
  active?: boolean
  onClear?: () => void
}
export const FilterSection = ({
  children,
  title,
  active,
  onClear,
}: FilterSectionProps) => {
  const disclosure = useDisclosure()
  return (
    <Box>
      <Flex
        onClick={disclosure.onToggle}
        cursor="pointer"
        bg="gray.200"
        align="center"
        py={2}
        px={2}
        boxShadow="md"
        borderRadius="sm"
      >
        {disclosure.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        <Text textStyle="h3" ml={2} flex={1} fontWeight={500}>
          {title}
        </Text>
        <Center
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          boxSize={3}
          borderRadius="full"
          bg="white"
          _hover={active && { bg: 'red.200' }}
        >
          <StatusIcon status={active ? 'positive' : 'disabled'} />
        </Center>
      </Flex>
      <Box mt={4} display={disclosure.isOpen ? 'block' : 'none'}>
        {children}
      </Box>
    </Box>
  )
}
