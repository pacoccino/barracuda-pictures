import { Tag, TagNew } from 'src/design-system'
import { TagStatus, TagProps } from 'src/design-system/components/Tag'
import { useTagContext } from 'src/contexts/tags'
import { AddIcon, EditIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons'

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

export const TagItemNew = ({ tag, showGroup, showMenu, ...args }) => {
  const { setTagForDelete, setTagForEdit } = useTagContext()
  return (
    <TagNew
      menuItems={
        showMenu && [
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
        ]
      }
      color="green"
      groupColor="red"
      name={tag.name}
      groupName={showGroup && tag.tagGroup?.name}
      {...args}
    />
  )
}

//       menuItems={[{ icon: <DeleteIcon />, onClick: null, label: 'dekete' }]}
export const TagGroupItemNew = ({ tagGroup, showMenu, ...args }) => {
  const {
    setTagGroupCreateOpen,
    setTagCreateTagGroup,
    setTagGroupForDelete,
    setTagGroupForEdit,
  } = useTagContext()
  return (
    <TagNew
      menuItems={
        showMenu && [
          {
            icon: <AddIcon />,
            onClick: () => setTagCreateTagGroup(tagGroup),
            label: 'Create tag in group',
          },
          {
            icon: <PlusSquareIcon />,
            onClick: () => setTagGroupCreateOpen(tagGroup),
            label: 'Create new tag group',
          },
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
        ]
      }
      color="red"
      name={tagGroup.name}
      {...args}
    />
  )
}

export { TagItem, TagGroupItem, TagItemWithGroup }
