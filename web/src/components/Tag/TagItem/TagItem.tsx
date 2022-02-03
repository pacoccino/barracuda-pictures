import {
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Tag,
} from 'src/design-system'
import { TagStatus, TagProps } from 'src/design-system/components/Tag'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons'

type TagItemProps = {
  tag: { id: string; name: string }
  actionLabel?: string
  handleAction?: () => void
  status?: TagStatus
}

type TagItemWithGroupProps = TagItemProps & {
  tag: { id: string; name: string; tagGroup: { id: string; name: string } }
}

const TagItem = ({ tag, ...tagArgs }: TagProps & TagItemProps) => {
  return <Tag name={tag.name} color="green" {...tagArgs} />
}

const TagItemWithGroup = ({
  tag,
  ...tagArgs
}: TagProps & TagItemWithGroupProps) => {
  return (
    <Tag
      name={tag.name}
      color="green"
      category={{ name: tag.tagGroup.name, color: 'red' }}
      {...tagArgs}
    />
  )
}

const TagGroupItem = ({ tagGroup, ...tagArgs }) => {
  return <Tag name={tagGroup.name} color="red" {...tagArgs} />
}

export const TagNew = ({ leftAction, rightAction, tag }) => {
  return (
    <Flex
      borderRadius={4}
      bg="green.500"
      h={6}
      pl={leftAction ? 1 : 2}
      pr={rightAction ? 1 : 2}
      align="center"
    >
      {leftAction && <Box>{leftAction}</Box>}

      <Text color="white" fontSize="xs">
        {tag.name}
      </Text>

      {rightAction && <Box>{rightAction}</Box>}
    </Flex>
  )
}
export const TagGroupNew = ({ leftAction, rightAction, tagGroup }) => {
  return (
    <HStack
      borderRadius={4}
      bg="red.500"
      h={6}
      align="center"
      justify="start"
      pl={leftAction ? 1 : 2}
      pr={rightAction ? 1 : 2}
    >
      {leftAction && <Box>{leftAction}</Box>}

      <Text color="white" fontSize="xs">
        {tagGroup.name}
      </Text>

      {rightAction && <Box>{rightAction}</Box>}
    </HStack>
  )
}

export { TagItem, TagGroupItem, TagItemWithGroup }
