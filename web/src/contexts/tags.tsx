import type { Tag, TagGroup } from 'types/graphql'
import { useContext, useState } from 'react'
import { CreateTagGroupModal } from 'src/components/Tag/EditTagsModal/CreateTagGroupModal'
import { CreateTagModal } from 'src/components/Tag/EditTagsModal/CreateTagModal'
import { DeleteTagModal } from 'src/components/Tag/EditTagsModal/DeleteTagModal'
import { DeleteTagGroupModal } from 'src/components/Tag/EditTagsModal/DeleteTagGroupModal'
import { EditTagModal } from 'src/components/Tag/EditTagsModal/EditTagModal'
import { EditTagGroupModal } from 'src/components/Tag/EditTagsModal/EditTagGroupModal'

interface TagContextType {
  setTagGroupCreateOpen: (b: boolean) => void
  setTagGroupForDelete: (tg: TagGroup) => void
  setTagGroupForEdit: (tg: TagGroup) => void
  setTagCreateTagGroup: (tg: TagGroup) => void
  setTagForDelete: (t: Tag) => void
  setTagForEdit: (t: Tag) => void
}

export const TagContext = React.createContext<TagContextType>({
  setTagGroupCreateOpen: () => 0,
  setTagGroupForDelete: () => 0,
  setTagGroupForEdit: () => 0,
  setTagCreateTagGroup: () => 0,
  setTagForDelete: () => 0,
  setTagForEdit: () => 0,
})

export const TagContextProvider = ({ children }) => {
  const [tagGroupCreateOpen, setTagGroupCreateOpen] = useState(false)

  const [tagGroupForDelete, setTagGroupForDelete] = useState<TagGroup | null>(
    null
  )
  const [tagGroupForEdit, setTagGroupForEdit] = useState<TagGroup | null>(null)
  const [tagCreateTagGroup, setTagCreateTagGroup] = useState<TagGroup | null>(
    null
  )
  const [tagForDelete, setTagForDelete] = useState<Tag | null>(null)
  const [tagForEdit, setTagForEdit] = useState<Tag | null>(null)

  return (
    <TagContext.Provider
      value={{
        setTagGroupCreateOpen,
        setTagGroupForDelete,
        setTagGroupForEdit,
        setTagCreateTagGroup,
        setTagForDelete,
        setTagForEdit,
      }}
    >
      {children}

      <CreateTagGroupModal
        isOpen={tagGroupCreateOpen}
        onClose={() => setTagGroupCreateOpen(false)}
      />
      <CreateTagModal
        tagGroup={tagCreateTagGroup}
        onClose={() => setTagCreateTagGroup(null)}
      />
      <DeleteTagModal
        tag={tagForDelete}
        onClose={() => setTagForDelete(null)}
      />
      <DeleteTagGroupModal
        tagGroup={tagGroupForDelete}
        onClose={() => setTagGroupForDelete(null)}
      />
      <EditTagModal tag={tagForEdit} onClose={() => setTagForEdit(null)} />
      <EditTagGroupModal
        tagGroup={tagGroupForEdit}
        onClose={() => setTagGroupForEdit(null)}
      />
    </TagContext.Provider>
  )
}

export const useTagContext = () => useContext(TagContext)
