import DateRangePicker from '@wojtekmaj/react-daterange-picker'

import {
  Box,
  IconButton,
  Button,
  Flex,
  Heading,
  Text,
  Icon,
  Switch,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useMemo, useCallback } from 'react'
import { useFilterContext } from 'src/contexts/filter'
import { TagStatus } from 'src/design-system/components/Tag'
import {
  TagGroupItemNew,
  TagItemWithGroup,
  TagItemNew,
} from 'src/components/Tag/TagItem/TagItem'
import { AddIcon } from '@chakra-ui/icons'
import { useTagContext } from 'src/contexts/tags'

const FilterStatusIcon = ({ color }) => (
  <Icon viewBox="25 25 150 150" color={color} boxSize={2} mr={1}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
)

const DatePanel = () => {
  const { dateRange, setDateRange } = useFilterContext()

  const onChange = (newValue) => {
    if (newValue && newValue[0] && newValue[1])
      setDateRange({
        from: newValue[0],
        to: newValue[1],
      })
    else setDateRange(null)
  }

  return (
    <Box>
      <Heading textStyle="h3" size="sm" mb={2} flex="1">
        Date Range
      </Heading>
      <DateRangePicker
        calendarIcon={null}
        onChange={onChange}
        value={dateRange && [dateRange.from, dateRange.to]}
      />
    </Box>
  )
}

const STATUS_TO_COLOR = {
  positive: 'blue.300',
  disabled: 'gray.100',
  negative: 'red.600',
}

const TagsPanel = ({ tagGroups }) => {
  const {
    selectedTagIds,
    addTagToFilter,
    removeTagToFilter,
    tagListConditions,
    setTagListCondition,
  } = useFilterContext()

  const { setTagGroupCreateOpen, setTagCreateTagGroup } = useTagContext()
  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )
  return (
    <VStack flex={1} overflow="hidden" align="stretch">
      <Flex>
        <Heading textStyle="h3" size="sm" mb={2} flex="1">
          Tags
        </Heading>
        <Button
          onClick={() => setTagGroupCreateOpen(true)}
          leftIcon={<AddIcon />}
          size="xs"
          colorScheme="blue"
          variant="solid"
        >
          Create Tag Group
        </Button>
      </Flex>
      <VStack
        flex={1}
        overflowX="hidden"
        overflowY="scroll"
        py={1}
        align="stretch"
      >
        {tagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <Flex>
              <Flex flex={1}>
                <TagGroupItemNew tagGroup={tagGroup} showMenu />

                <IconButton
                  aria-label="create tag"
                  size="xs"
                  colorScheme="blue"
                  variant="solid"
                  icon={<AddIcon />}
                  onClick={() => setTagCreateTagGroup(tagGroup)}
                  ml={2}
                />
              </Flex>
              <Flex align="center">
                <Text fontSize="sm">
                  {tagListConditions[tagGroup.id] || 'OR'}
                </Text>
                <Switch
                  isChecked={tagListConditions[tagGroup.id] === 'AND'}
                  onChange={() =>
                    setTagListCondition(
                      tagGroup,
                      tagListConditions[tagGroup.id] === 'AND' ? 'OR' : 'AND'
                    )
                  }
                  ml={1}
                  size="sm"
                />
              </Flex>
            </Flex>
            <Wrap my={2}>
              {tagGroup.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <TagItemNew
                    tag={tag}
                    onClick={
                      isTagSelected(tag)
                        ? () => removeTagToFilter(tag, tagGroup)
                        : () => addTagToFilter(tag, tagGroup)
                    }
                    leftAction={
                      <FilterStatusIcon
                        color={
                          STATUS_TO_COLOR[
                            isTagSelected(tag)
                              ? TagStatus.positive
                              : TagStatus.disabled
                          ]
                        }
                      />
                    }
                    actionLabel={
                      isTagSelected(tag)
                        ? 'Remove from filter'
                        : 'Add to filter'
                    }
                    showMenu
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}

const SelectedTagsPanel = ({ tagGroups }) => {
  const { selectedTagIds, removeTagToFilter, clearFilter } = useFilterContext()

  const tags = useMemo(
    () => tagGroups.reduce((acc, tagGroup) => acc.concat(tagGroup.tags), []),
    [tagGroups]
  )
  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.indexOf(tag.id) !== -1),
    [selectedTagIds, tags]
  )

  return (
    <VStack align="stretch">
      <Flex>
        <Heading textStyle="h3" size="sm" mb={2} flex="1">
          Filters
        </Heading>
        <Button
          onClick={clearFilter}
          size="xs"
          bg="red.200"
          disabled={selectedTags.length === 0}
        >
          {selectedTags.length > 0 ? 'Clear filters' : 'No active filters'}
        </Button>
      </Flex>
      {selectedTags.length > 0 && (
        <Wrap>
          {selectedTags.map((tag) => (
            <WrapItem key={tag.id}>
              <TagItemWithGroup
                tag={tag}
                actionLabel="Remove from filter"
                onClick={() => removeTagToFilter(tag, tag.tagGroup)}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  )
}

const FilterPanel = ({ tagGroups }) => {
  return (
    <VStack py={4} px={2} align="stretch" h="100%">
      <TagsPanel tagGroups={tagGroups} />
      <DatePanel />
      <SelectedTagsPanel tagGroups={tagGroups} />
    </VStack>
  )
}

export default FilterPanel
