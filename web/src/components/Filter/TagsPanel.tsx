import {
  Box,
  Button,
  Flex,
  IconButton,
  Switch,
  Text,
  useDisclosure,
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
import {
  DefaultSpinner,
  StatusIcon,
  TooltipIconButton,
} from 'src/design-system'
import { FilterSection } from 'src/components/Filter/FilterSection'
import { useQuery } from '@redwoodjs/web'

export const TagsPanel = () => {
  const { selectedTagIds, clearTags } = useFilterContext()

  return (
    <FilterSection
      title="Tags"
      active={selectedTagIds.length > 0}
      onClear={clearTags}
    >
      <AvailableTagsPanel />
    </FilterSection>
  )
}

export const QUERY_FILTERED_TAGS = gql`
  query FindFilteredTags($filter: ImageFilters) {
    tagsFromFilter(filter: $filter) {
      id
      name
    }
  }
`

const AvailableTagsPanel = () => {
  const {
    filter,
    selectedTagIds,
    addTagToFilter,
    removeTagToFilter,
    tagListConditions,
    setTagListCondition,
  } = useFilterContext()

  const allTagsDisclosure = useDisclosure()

  const filteredTagsQuery = useQuery(QUERY_FILTERED_TAGS, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      filter,
    },
  })

  const { tagsQuery, setTagGroupCreateOpen, setTagCreateTagGroup } =
    useTagContext()

  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )

  const filteredTagGroups = useMemo(() => {
    if (tagsQuery.loading) return []
    if (allTagsDisclosure.isOpen) return tagsQuery.data.tagGroups

    if (filteredTagsQuery.loading) return []

    return tagsQuery.data.tagGroups
      .map((tagGroup) => {
        return {
          ...tagGroup,
          tags: tagGroup.tags.filter((tag) => {
            return (
              filteredTagsQuery.data.tagsFromFilter.findIndex(
                (t) => t.id === tag.id
              ) !== -1
            )
          }),
        }
      })
      .filter((tagGroup) => tagGroup.tags.length > 0)
  }, [filteredTagsQuery, tagsQuery])

  if (filteredTagsQuery.loading || tagsQuery.loading) {
    return <DefaultSpinner />
  }

  return (
    <VStack align="stretch">
      <Flex align="center">
        <Text textStyle="h3" flex={1}>
          {allTagsDisclosure.isOpen ? 'All tags' : 'Tags on filter'}
        </Text>
        <Switch
          isChecked={allTagsDisclosure.isOpen}
          onChange={allTagsDisclosure.onToggle}
          mr={2}
          size="md"
        />
        <Button
          onClick={() => setTagGroupCreateOpen(true)}
          leftIcon={<AddIcon />}
          size="xs"
          colorScheme="orchid"
          variant="solid"
        >
          Create Tag Group
        </Button>
      </Flex>

      <VStack flex={1} py={1} align="stretch">
        {filteredTagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <Flex>
              <Flex flex={1}>
                <TagGroupItem tagGroup={tagGroup} showMenu />

                <TooltipIconButton
                  label="Create tag"
                  tooltipProps={{ placement: 'right' }}
                  aria-label="create tag"
                  size="xs"
                  colorScheme="fulvous"
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
                      <StatusIcon
                        status={
                          isTagSelected(tag)
                            ? TagStatus.positive
                            : TagStatus.disabled
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

      <Text textStyle="h3" mb={4} flex="1">
        Selected
      </Text>
      <SelectedTagsPanel />
    </VStack>
  )
}

const SelectedTagsPanel = () => {
  const { selectedTagIds, removeTagToFilter } = useFilterContext()

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
  )
}
