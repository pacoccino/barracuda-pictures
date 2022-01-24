import { Box, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import { TagGroupItem, TagItem } from 'src/components/Tag/TagItem/TagItem'

const TagList = ({ tagGroups }) => {
  return (
    <Box>
      <h2>Tags</h2>
      <VStack>
        {tagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <TagGroupItem tagGroup={tagGroup} />
            <Wrap m={2} spacing={0.5}>
              {tagGroup.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <TagItem tag={tag} />
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default TagList
