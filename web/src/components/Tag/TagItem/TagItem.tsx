import { Tag, TagGroup } from 'types/graphql'

import { TagComponent } from 'src/design-system'
import { TagProps } from 'src/design-system/components/TagComponent'
import { useTagContext } from 'src/contexts/tags'
import { AddIcon, EditIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons'

type TagItemProps = {
  tag: Tag
  showGroup?: boolean
  showMenu?: boolean
}

type Optional<T> = { [K in keyof T]?: K }
type OptionalMerge<T1, T2> = T1 & Optional<T2>

export const TagItem = ({
  tag,
  showGroup,
  showMenu,
  ...args
}: TagItemProps & Partial<TagProps>) => {
  const { setTagForDelete, setTagForEdit, setTagForMove } = useTagContext()
  return (
    <TagComponent
      menuItems={
        showMenu && [
          {
            icon: <EditIcon />,
            onClick: () => setTagForEdit(tag),
            label: 'Edit tag',
          },
          {
            icon: <EditIcon />,
            onClick: () => setTagForMove(tag),
            label: 'Move to other group',
          },
          {
            icon: <DeleteIcon />,
            onClick: () => setTagForDelete(tag),
            label: 'Delete tag',
          },
        ]
      }
      color="celadon"
      groupColor="fulvous"
      name={tag.name}
      groupName={showGroup && tag.tagGroup?.name}
      {...args}
    />
  )
}

type TagGroupItemProps = {
  tagGroup: TagGroup
  showGroup?: boolean
  showMenu?: boolean
}
export const TagGroupItem = ({
  tagGroup,
  showMenu,
  ...args
}: OptionalMerge<TagGroupItemProps, TagProps>) => {
  const {
    setTagGroupCreateOpen,
    setTagCreateTagGroup,
    setTagGroupForDelete,
    setTagGroupForEdit,
  } = useTagContext()
  return (
    <TagComponent
      menuItems={
        showMenu
          ? [
              {
                icon: <AddIcon />,
                onClick: () => setTagCreateTagGroup(tagGroup),
                label: 'Create tag in group',
              },
              {
                icon: <PlusSquareIcon />,
                onClick: () => setTagGroupCreateOpen(true),
                label: 'Create category',
              },
              {
                icon: <EditIcon />,
                onClick: () => setTagGroupForEdit(tagGroup),
                label: 'Edit category',
              },
              {
                icon: <DeleteIcon />,
                onClick: () => setTagGroupForDelete(tagGroup),
                label: 'Delete category',
              },
            ]
          : undefined
      }
      color="fulvous"
      name={tagGroup.name}
      {...args}
    />
  )
}
