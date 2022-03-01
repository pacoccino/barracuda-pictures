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
import { DefaultSpinner, StatusIcon } from 'src/design-system'
import { FilterSection } from 'src/components/Filter/FilterSection'

export const TagsPanel = () => {
  const {
    selectedTagIds,
    clearTags,
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
    <FilterSection
      title="Tags"
      active={selectedTagIds.length > 0}
      onClear={clearTags}
    >
      <VStack overflow="hidden" align="stretch">
        <Flex align="center">
          <Text textStyle="h3" size="sm" mb={2} flex="1">
            Available
          </Text>
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
      </VStack>
      <Text textStyle="h3" size="sm" mb={2} flex="1">
        Selected
      </Text>
      <SelectedTagsPanel />
    </FilterSection>
  )
}

export const SelectedTagsPanel = () => {
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
