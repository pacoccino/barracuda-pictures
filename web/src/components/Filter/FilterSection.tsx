import {
  Tooltip,
  Center,
  Box,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
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
        bg="gray.200"
        _hover={{ bg: 'gray.300' }}
        align="stretch"
        boxShadow="md"
        borderRadius="md"
      >
        <Flex
          flex={1}
          align="center"
          py={2}
          pl={2}
          onClick={disclosure.onToggle}
          cursor="pointer"
        >
          {disclosure.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          <Text textStyle="h3" ml={2} flex={1} fontWeight={500}>
            {title}
          </Text>
        </Flex>
        <Tooltip label={active && 'Clear filter'}>
          <Center
            w={6}
            _hover={active && { bg: 'red.200' }}
            onClick={onClear}
            cursor="pointer"
            borderRadius="full"
            mr={1}
          >
            <Center boxSize={3} borderRadius="full" bg="white">
              <StatusIcon status={active ? 'positive' : 'disabled'} />
            </Center>
          </Center>
        </Tooltip>
      </Flex>
      <Box mt={4} display={disclosure.isOpen ? 'block' : 'none'}>
        {children}
      </Box>
    </Box>
  )
}
