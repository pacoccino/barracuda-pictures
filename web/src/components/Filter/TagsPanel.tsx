import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Switch,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { useTagContext } from 'src/contexts/tags'
import { useCallback, useMemo } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { TagGroupItem, TagItem } from 'src/components/Tag/TagItem/TagItem'
import { TagStatus } from 'src/design-system/components/TagComponent'
import { DefaultSpinner } from 'src/design-system'

const FilterStatusIcon = ({ color }) => (
  <Icon viewBox="25 25 150 150" color={color} boxSize={2} mr={1}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
)

const STATUS_TO_COLOR = {
  positive: 'blue.300',
  disabled: 'gray.100',
  negative: 'red.600',
}

export const TagsPanel = () => {
  const {
    selectedTagIds,
    addTagToFilter,
    removeTagToFilter,
    tagListConditions,
    setTagListCondition,
  } = useFilterContext()

  const { tagsQuery, setTagGroupCreateOpen, setTagCreateTagGroup } =
    useTagContext()

  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )

  if (tagsQuery.loading) {
    return <DefaultSpinner />
  }

  const tagGroups = tagsQuery.data.tagGroups
  return (
    <VStack overflow="hidden" align="stretch">
      <Flex align="center">
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
                <TagGroupItem tagGroup={tagGroup} showMenu />

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
                  <TagItem
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

export const SelectedTagsPanel = () => {
  const { selectedTagIds, removeTagToFilter, clearFilter } = useFilterContext()

  const { tagsQuery } = useTagContext()
  const tagGroups = tagsQuery.data?.tagGroups || []

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
              <TagItem
                tag={tag}
                showGroup
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
