import { Tag, TagLabel, TagRightIcon } from '@chakra-ui/react'
import { As } from '@chakra-ui/system/dist/declarations/src/system.types'

type TagItemProps = {
  tag: { id: string; name: string }
  handleAction?: () => void
}

type TagItemWithGroupProps = TagItemProps & {
  tag: { id: string; name: string; tagGroup: { id: string; name: string } }
  handleAction?: () => void
  actionIcon?: As
}

const TagItem = ({ tag, handleAction }: TagItemProps) => {
  return (
    <Tag
      borderRadius="full"
      variant="solid"
      colorScheme="green"
      onClick={handleAction}
    >
      <TagLabel>{tag.name}</TagLabel>
    </Tag>
  )
}

const TagItemWithGroup = ({
  tag,
  handleAction,
  actionIcon,
}: TagItemWithGroupProps) => {
  return (
    <Tag
      borderRadius="full"
      variant="solid"
      colorScheme="green"
      onClick={handleAction}
    >
      <Tag borderRadius="full" variant="solid" colorScheme="red" mr={2}>
        <TagLabel>{tag.tagGroup.name}</TagLabel>
      </Tag>
      <TagLabel>{tag.name}</TagLabel>
      {actionIcon && <TagRightIcon boxSize="12px" as={actionIcon} />}
    </Tag>
  )
}

const TagGroupItem = ({ tagGroup }) => {
  return (
    <Tag borderRadius="full" variant="solid" colorScheme="red">
      <TagLabel>{tagGroup.name}</TagLabel>
    </Tag>
  )
}

export { TagItem, TagGroupItem, TagItemWithGroup }
