import { Box, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import {
  TagGroupItem,
  TagItem,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'
import type { Tag, TagGroup } from 'types/graphql'
import { TagProps, TagStatus } from 'src/design-system/components/Tag'

type TagListProps = {
  onClick?: (Tag) => void
  selectedTags?: Tag[]
}

type TagListGroupedProps = TagListProps & {
  tagGroups: TagGroup[]
}
type TagListFlatProps = TagListProps & {
  tags: Tag[]
}

const TagListGrouped = ({
  tagGroups,
  onClick,
  selectedTags,
  ...tagArgs
}: TagProps & TagListGroupedProps) => {
  return (
    <VStack>
      {tagGroups.map((tagGroup) => (
        <Box key={tagGroup.id}>
          <TagGroupItem tagGroup={tagGroup} />
          <Wrap m={2}>
            {tagGroup.tags.map((tag) => (
              <WrapItem key={tag.id}>
                <TagItem
                  tag={tag}
                  handleAction={() => onClick(tag)}
                  status={
                    selectedTags && selectedTags.find((t) => t.id === tag.id)
                      ? TagStatus.positive
                      : TagStatus.disabled
                  }
                  {...tagArgs}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      ))}
    </VStack>
  )
}

const TagListFlat = ({
  tags,
  onClick,
  ...tagArgs
}: TagProps & TagListFlatProps) => {
  return (
    <Wrap>
      {tags.map((tag) => (
        <WrapItem key={tag.id}>
          <TagItemWithGroup
            tag={tag}
            handleAction={onClick && (() => onClick(tag))}
            {...tagArgs}
          />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export { TagListGrouped, TagListFlat }
