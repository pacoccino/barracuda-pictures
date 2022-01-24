import { Wrap, WrapItem } from '@chakra-ui/react'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'

const TagList = ({ tags }) => {
  return (
    <Wrap m={2} spacing={0.5}>
      {tags.map((tag) => (
        <WrapItem key={tag.id}>
          <TagItemWithGroup tag={tag}>{tag.name}</TagItemWithGroup>
        </WrapItem>
      ))}
    </Wrap>
  )
}

export default TagList
