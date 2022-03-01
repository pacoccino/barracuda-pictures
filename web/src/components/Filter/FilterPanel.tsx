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
        borderTop="1px solid black"
        borderBottom="1px solid black"
        align="center"
        py={2}
        px={2}
      >
        {disclosure.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        <Text textStyle="h3" ml={2}>
          {title}
        </Text>
      </Flex>
      {disclosure.isOpen && <Box mt={4}>{children}</Box>}
    </Box>
  )
}

const FilterPanel = () => {
  return (
    <VStack py={4} px={2} spacing={4} align="stretch" h="100%">
      <Text align="center">Filter</Text>

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
