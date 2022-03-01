import { Box, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { PathPanel } from './PathPanel'
import { DatePanel } from './DatePanel'
import { TagsPanel, SelectedTagsPanel } from './TagsPanel'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'

const Section = ({ children, title }) => {
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
        <Text textStyle="h3" ml={2}>
          {title}
        </Text>
      </Flex>
      <Box mt={4} display={disclosure.isOpen ? 'block' : 'none'}>
        {children}
      </Box>
    </Box>
  )
}

const FilterPanel = () => {
  return (
    <VStack py={4} px={2} spacing={4} align="stretch" h="100%">
      <Text align="center">Filters</Text>

      <Section title="Path">
        <PathPanel />
      </Section>
      <Section title="Date">
        <DatePanel />
      </Section>
      <Section title="Tags">
        <TagsPanel />
      </Section>
      <SelectedTagsPanel />
    </VStack>
  )
}

export default FilterPanel
