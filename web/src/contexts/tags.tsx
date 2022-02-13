import type { Tag, TagGroup } from 'types/graphql'
import { useContext, useState } from 'react'
import { CreateTagGroupModal } from 'src/components/Tag/EditTags/CreateTagGroupModal'
import { CreateTagModal } from 'src/components/Tag/EditTags/CreateTagModal'
import { DeleteTagModal } from 'src/components/Tag/EditTags/DeleteTagModal'
import { DeleteTagGroupModal } from 'src/components/Tag/EditTags/DeleteTagGroupModal'
import { MoveTagModal } from 'src/components/Tag/EditTags/MoveTagModal'
import { EditTagModal } from 'src/components/Tag/EditTags/EditTagModal'
import { EditTagGroupModal } from 'src/components/Tag/EditTags/EditTagGroupModal'
import { useQuery } from '@redwoodjs/web'

export const QUERY = gql`
  query FindTags {
    tagGroups {
      id
      name
      tags {
        id
        name
        tagGroup {
          id
          name
        }
      }
    }
  }
`

export const QUERIES_TO_REFETCH = ['FindTags']

interface TagContextType {
  setTagGroupCreateOpen: (b: boolean) => void
  setTagGroupForDelete: (tg: TagGroup) => void
  setTagGroupForEdit: (tg: TagGroup) => void
  setTagCreateTagGroup: (tg: TagGroup) => void
  setTagForMove: (t: Tag) => void
  setTagForDelete: (t: Tag) => void
  setTagForEdit: (t: Tag) => void
  tagsQuery: QueryOperationResult<{ tagGroups: TagGroup[] }>
}

export const TagContext = React.createContext<TagContextType>({
  setTagGroupCreateOpen: () => 0,
  setTagGroupForDelete: () => 0,
  setTagGroupForEdit: () => 0,
  setTagCreateTagGroup: () => 0,
  setTagForMove: () => 0,
  setTagForDelete: () => 0,
  setTagForEdit: () => 0,
  tagsQuery: { loading: false, data: null },
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
  const [tagForMove, setTagForMove] = useState<Tag | null>(null)
  const [tagForDelete, setTagForDelete] = useState<Tag | null>(null)
  const [tagForEdit, setTagForEdit] = useState<Tag | null>(null)

  const tagsQuery = useQuery(QUERY, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  })

  return (
    <TagContext.Provider
      value={{
        setTagGroupCreateOpen,
        setTagGroupForDelete,
        setTagGroupForEdit,
        setTagCreateTagGroup,
        setTagForDelete,
        setTagForMove,
        setTagForEdit,
        tagsQuery,
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
      <MoveTagModal tag={tagForMove} onClose={() => setTagForMove(null)} />
      <EditTagModal tag={tagForEdit} onClose={() => setTagForEdit(null)} />
      <EditTagGroupModal
        tagGroup={tagGroupForEdit}
        onClose={() => setTagGroupForEdit(null)}
      />
    </TagContext.Provider>
  )
}

export const useTagContext = () => useContext(TagContext)
