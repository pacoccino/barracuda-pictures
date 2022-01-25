import { Tag } from 'src/design-system'
import { TagStatus, TagProps } from 'src/design-system/components/Tag'

type TagItemProps = {
  tag: { id: string; name: string }
  actionLabel?: string
  handleAction?: () => void
  status?: TagStatus
}

type TagItemWithGroupProps = TagItemProps & {
  tag: { id: string; name: string; tagGroup: { id: string; name: string } }
}

const TagItem = ({
  tag,
  actionLabel,
  handleAction,
  ...tagArgs
}: TagProps & TagItemProps) => {
  return (
    <Tag
      name={tag.name}
      color="green"
      onClick={handleAction}
      actionLabel={actionLabel}
      {...tagArgs}
    />
  )
}

const TagItemWithGroup = ({
  tag,
  handleAction,
  actionLabel,
  ...tagArgs
}: TagProps & TagItemWithGroupProps) => {
  return (
    <Tag
      name={tag.name}
      color="green"
      onClick={handleAction}
      category={{ name: tag.tagGroup.name, color: 'red' }}
      actionLabel={actionLabel}
      {...tagArgs}
    />
  )
}

const TagGroupItem = ({ tagGroup }) => {
  return <Tag name={tagGroup.name} color="red" />
}

export { TagItem, TagGroupItem, TagItemWithGroup }
