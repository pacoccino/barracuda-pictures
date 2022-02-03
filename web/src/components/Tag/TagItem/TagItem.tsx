import { Tag, TagNew } from 'src/design-system'
import { TagStatus, TagProps } from 'src/design-system/components/Tag'
import { useTagContext } from 'src/contexts/tags'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

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
  const { setTagForDelete, setTagForEdit } = useTagContext()
  return (
    <TagNew
      menuItems={[
        {
          icon: <EditIcon />,
          onClick: () => setTagForEdit(tag),
          label: 'Edit tag',
        },
        {
          icon: <DeleteIcon />,
          onClick: () => setTagForDelete(tag),
          label: 'Delete tag',
        },
      ]}
      color="green"
      name={tag.name}
      {...args}
    />
  )
}

//       menuItems={[{ icon: <DeleteIcon />, onClick: null, label: 'dekete' }]}
export const TagGroupItemNew = ({ tagGroup, ...args }) => {
  const { setTagGroupForDelete, setTagGroupForEdit } = useTagContext()
  return (
    <TagNew
      menuItems={[
        {
          icon: <EditIcon />,
          onClick: () => setTagGroupForEdit(tagGroup),
          label: 'Edit tag group',
        },
        {
          icon: <DeleteIcon />,
          onClick: () => setTagGroupForDelete(tagGroup),
          label: 'Delete tag group',
        },
      ]}
      color="red"
      name={tagGroup.name}
      {...args}
    />
  )
}

export { TagItem, TagGroupItem, TagItemWithGroup }
