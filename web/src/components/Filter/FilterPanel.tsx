import { Button, Flex, Switch, Text, VStack } from '@chakra-ui/react'
import { PathPanel } from './PathPanel'
import { DatePanel } from './DatePanel'
import { RatingPanel } from './RatingPanel'
import { TagsPanel } from './TagsPanel'
import { useFilterContext } from 'src/contexts/filter'
import { useApluContext, APLUMode } from 'src/contexts/aplu'

const FilterPanel = () => {
  const { apluMode, switchAPLUMode } = useApluContext()
  const { clearFilter, isFilterActive } = useFilterContext()

  return (
    <Flex h="100%" overflow="hidden" direction="column">
      <Flex px={2} py={4} align="center">
        <Text textStyle="h1" fontSize="md" ml={2} flex="1">
          Filters
        </Text>
        <Flex align="center">
          <Text fontSize="sm">{apluMode}</Text>
          <Switch
            isChecked={apluMode === APLUMode.FILTER}
            onChange={() => switchAPLUMode()}
            ml={1}
            size="sm"
          />
        </Flex>
        <Button
          onClick={clearFilter}
          size="xs"
          bg={isFilterActive ? 'red.200' : undefined}
          disabled={!isFilterActive}
        >
          {isFilterActive ? 'Clear filters' : 'No active filters'}
        </Button>
      </Flex>

      <VStack
        px={2}
        pb={8}
        flex={1}
        spacing={4}
        align="stretch"
        h="100%"
        overflow="auto"
      >
        <PathPanel />
        <DatePanel />
        <RatingPanel />
        <TagsPanel />
      </VStack>
    </Flex>
  )
}

export default FilterPanel
