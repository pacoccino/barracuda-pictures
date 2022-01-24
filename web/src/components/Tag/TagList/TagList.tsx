import { Box, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import {
  TagGroupItem,
  TagItem,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'
import type { Tag, TagGroup } from 'types/graphql'

type TagListProps = {
  onClick?: (Tag) => void
}

type TagListGroupedProps = TagListProps & {
  tagGroups: TagGroup[]
}
type TagListFlatProps = TagListProps & {
  tags: Tag[]
}

const TagListGrouped = ({ tagGroups, onClick }: TagListGroupedProps) => {
  return (
    <VStack>
      {tagGroups.map((tagGroup) => (
        <Box key={tagGroup.id}>
          <TagGroupItem tagGroup={tagGroup} />
          <Wrap m={2}>
            {tagGroup.tags.map((tag) => (
              <WrapItem key={tag.id}>
                <TagItem tag={tag} handleAction={() => onClick(tag)} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      ))}
    </VStack>
  )
}

const TagListFlat = ({ tags, onClick }: TagListFlatProps) => {
  return (
    <Wrap m={2}>
      {tags.map((tag) => (
        <WrapItem key={tag.id}>
          <TagItemWithGroup tag={tag} handleAction={() => onClick(tag)} />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export { TagListGrouped, TagListFlat }
