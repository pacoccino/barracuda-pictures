import { Badge, Box, VStack, Wrap, WrapItem } from '@chakra-ui/react'

const TagsList = ({ tagGroups }) => {
  return (
    <Box>
      <h2>Tags</h2>
      <VStack>
        {tagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <h3>{tagGroup.name}</h3>
            <Wrap m={2} spacing={0.5}>
              {tagGroup.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <Badge>{tag.name}</Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default TagsList
