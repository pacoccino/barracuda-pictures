import { Tag, TagNew } from 'src/design-system'
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

export const TagItemNew = ({ tag, ...args }) => {
  return <TagNew color="green" name={tag.name} {...args} />
}

//       menuItems={[{ icon: <DeleteIcon />, onClick: null, label: 'dekete' }]}
export const TagGroupItemNew = ({ tagGroup, ...args }) => {
  return <TagNew color="red" name={tagGroup.name} {...args} />
}

export { TagItem, TagGroupItem, TagItemWithGroup }
