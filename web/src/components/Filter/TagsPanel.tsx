import {
  Box,
  Button,
  Flex,
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
import { TagCategoryItem, TagItem } from 'src/components/Tag/TagItem/TagItem'
import { TagStatus } from 'src/design-system/components/TagComponent'
import {
  DefaultSpinner,
  StatusIcon,
  TooltipIconButton,
} from 'src/design-system'
import { FilterSection } from 'src/components/Filter/FilterSection'
import { APLUMode, useApluContext } from 'src/contexts/aplu'

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
    selectedTagIds,
    addTagToFilter,
    removeTagToFilter,
    tagListConditions,
    setTagListCondition,
  } = useFilterContext()

  const { apluQuery, apluMode } = useApluContext()

  const { tagsQuery, setTagCategoryCreateOpen, setTagCreateTagCategory } =
    useTagContext()

  const isTagSelected = useCallback(
    (tag) => selectedTagIds.indexOf(tag.id) !== -1,
    [selectedTagIds]
  )

  const filteredTagCategorys = useMemo(() => {
    if (tagsQuery.loading) return []
    if (apluMode === APLUMode.ALL) return tagsQuery.data.tagCategorys

    if (apluQuery.loading) return []

    return tagsQuery.data.tagCategorys
      .map((tagCategory) => {
        return {
          ...tagCategory,
          tags: tagCategory.tags.filter((tag) => {
            return (
              apluQuery.data.attributesFromFilter.tags.findIndex(
                (t) => t.id === tag.id
              ) !== -1
            )
          }),
        }
      })
      .filter((tagCategory) => tagCategory.tags.length > 0)
  }, [apluQuery, tagsQuery])

  if (tagsQuery.loading) {
    return <DefaultSpinner />
  }

  return (
    <VStack align="stretch">
      <Flex align="center" justify="end">
        <Button
          onClick={() => setTagCategoryCreateOpen(true)}
          leftIcon={<AddIcon />}
          size="xs"
          colorScheme="orchid"
          variant="solid"
        >
          Create category
        </Button>
      </Flex>

      <VStack flex={1} py={1} align="stretch">
        {filteredTagCategorys.map((tagCategory) => (
          <Box key={tagCategory.id}>
            <Flex>
              <Flex flex={1}>
                <TagCategoryItem tagCategory={tagCategory} showMenu />

                <TooltipIconButton
                  label="Create tag"
                  tooltipProps={{ placement: 'right' }}
                  aria-label="create tag"
                  size="xs"
                  colorScheme="fulvous"
                  variant="solid"
                  icon={<AddIcon />}
                  onClick={() => setTagCreateTagCategory(tagCategory)}
                  ml={2}
                />
              </Flex>
              <Flex align="center">
                <Text fontSize="sm">
                  {tagListConditions[tagCategory.id] || 'OR'}
                </Text>
                <Switch
                  isChecked={tagListConditions[tagCategory.id] === 'AND'}
                  onChange={() =>
                    setTagListCondition(
                      tagCategory,
                      tagListConditions[tagCategory.id] === 'AND' ? 'OR' : 'AND'
                    )
                  }
                  ml={1}
                  size="sm"
                />
              </Flex>
            </Flex>
            <Wrap my={2}>
              {tagCategory.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <TagItem
                    tag={tag}
                    onClick={
                      isTagSelected(tag)
                        ? () => removeTagToFilter(tag, tagCategory)
                        : () => addTagToFilter(tag, tagCategory)
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
  const tagCategorys = tagsQuery.data?.tagCategorys || []

  const tags = useMemo(
    () =>
      tagCategorys.reduce(
        (acc, tagCategory) => acc.concat(tagCategory.tags),
        []
      ),
    [tagCategorys]
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
            onClick={() => removeTagToFilter(tag, tag.tagCategory)}
          />
        </WrapItem>
      ))}
    </Wrap>
  )
}
