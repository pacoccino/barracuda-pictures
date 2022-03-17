import { Tag, TagCategory } from 'types/graphql'

import { MenuItem, TagComponent } from 'src/design-system'
import { TagProps } from 'src/design-system/components/TagComponent'
import { useTagContext } from 'src/contexts/tags'
import { AddIcon, EditIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons'
import * as React from 'react'
import { MdDriveFileMoveOutline } from 'react-icons/md'

type TagItemProps = {
  tag: Tag
  showGroup?: boolean
  showMenu?: boolean
}

export const TagMenuItems = ({ tag }) => {
  const { setTagForDelete, setTagForEdit, setTagForMove } = useTagContext()

  const items = [
    {
      icon: <EditIcon />,
      onClick: () => setTagForEdit(tag),
      label: 'Edit tag',
    },
    {
      icon: <MdDriveFileMoveOutline />,
      onClick: () => setTagForMove(tag),
      label: 'Move to other group',
    },
    {
      icon: <DeleteIcon />,
      onClick: () => setTagForDelete(tag),
      label: 'Delete tag',
    },
  ].map((menuItem) => (
    <MenuItem
      key={menuItem.label}
      icon={menuItem.icon}
      onClick={menuItem.onClick}
    >
      {menuItem.label}
    </MenuItem>
  ))

  return <>{items}</>
}

export const TagItem = ({
  tag,
  showGroup,
  showMenu,
  ...args
}: TagItemProps & Partial<TagProps>) => {
  return (
    <TagComponent
      menuItems={showMenu && <TagMenuItems tag={tag} />}
      color="celadon"
      groupColor="fulvous"
      name={tag.name}
      groupName={showGroup && tag.tagCategory?.name}
      {...args}
    />
  )
}

type TagCategoryItemProps = {
  tagCategory: TagCategory
  showGroup?: boolean
  showMenu?: boolean
}

export const TagCategoryMenuItems = ({ tagCategory }) => {
  const {
    setTagCategoryCreateOpen,
    setTagCreateTagCategory,
    setTagCategoryForDelete,
    setTagCategoryForEdit,
  } = useTagContext()

  const items = [
    {
      icon: <AddIcon />,
      onClick: () => setTagCreateTagCategory(tagCategory),
      label: 'Create tag in this category',
    },
    {
      icon: <PlusSquareIcon />,
      onClick: () => setTagCategoryCreateOpen(true),
      label: 'Create category',
    },
    {
      icon: <EditIcon />,
      onClick: () => setTagCategoryForEdit(tagCategory),
      label: 'Edit category',
    },
    {
      icon: <DeleteIcon />,
      onClick: () => setTagCategoryForDelete(tagCategory),
      label: 'Delete category',
    },
  ].map((menuItem) => (
    <MenuItem
      key={menuItem.label}
      icon={menuItem.icon}
      onClick={menuItem.onClick}
    >
      {menuItem.label}
    </MenuItem>
  ))

  return <>{items}</>
}

export const TagCategoryItem = ({
  tagCategory,
  showMenu,
  ...args
}: TagCategoryItemProps & Partial<TagProps>) => {
  return (
    <TagComponent
      menuItems={
        showMenu ? (
          <TagCategoryMenuItems tagCategory={tagCategory} />
        ) : undefined
      }
      color="fulvous"
      name={tagCategory.name}
      {...args}
    />
  )
}
