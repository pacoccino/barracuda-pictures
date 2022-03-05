import type { Tag, TagCategory } from 'types/graphql'
import { useContext, useState } from 'react'
import { CreateTagCategoryModal } from 'src/components/Tag/EditTags/CreateTagCategoryModal'
import { CreateTagModal } from 'src/components/Tag/EditTags/CreateTagModal'
import { DeleteTagModal } from 'src/components/Tag/EditTags/DeleteTagModal'
import { DeleteTagCategoryModal } from 'src/components/Tag/EditTags/DeleteTagCategoryModal'
import { MoveTagModal } from 'src/components/Tag/EditTags/MoveTagModal'
import { EditTagModal } from 'src/components/Tag/EditTags/EditTagModal'
import { EditTagCategoryModal } from 'src/components/Tag/EditTags/EditTagCategoryModal'
import { useQuery } from '@redwoodjs/web'

export const QUERY = gql`
  query FindTags {
    tagCategorys {
      id
      name
      tags {
        id
        name
        tagCategory {
          id
          name
        }
      }
    }
  }
`

export const QUERIES_TO_REFETCH = ['FindTags']

interface TagContextType {
  setTagCategoryCreateOpen: (b: boolean) => void
  setTagCategoryForDelete: (tg: TagCategory) => void
  setTagCategoryForEdit: (tg: TagCategory) => void
  setTagCreateTagCategory: (tg: TagCategory) => void
  setTagForMove: (t: Tag) => void
  setTagForDelete: (t: Tag) => void
  setTagForEdit: (t: Tag) => void
  tagsQuery: QueryOperationResult<{ tagCategorys: TagCategory[] }>
}

export const TagContext = React.createContext<TagContextType>({
  setTagCategoryCreateOpen: () => 0,
  setTagCategoryForDelete: () => 0,
  setTagCategoryForEdit: () => 0,
  setTagCreateTagCategory: () => 0,
  setTagForMove: () => 0,
  setTagForDelete: () => 0,
  setTagForEdit: () => 0,
  tagsQuery: { loading: false, data: null },
})

export const TagContextProvider = ({ children }) => {
  const [tagCategoryCreateOpen, setTagCategoryCreateOpen] = useState(false)

  const [tagCategoryForDelete, setTagCategoryForDelete] =
    useState<TagCategory | null>(null)
  const [tagCategoryForEdit, setTagCategoryForEdit] =
    useState<TagCategory | null>(null)
  const [tagCreateTagCategory, setTagCreateTagCategory] =
    useState<TagCategory | null>(null)
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
        setTagCategoryCreateOpen,
        setTagCategoryForDelete,
        setTagCategoryForEdit,
        setTagCreateTagCategory,
        setTagForDelete,
        setTagForMove,
        setTagForEdit,
        tagsQuery,
      }}
    >
      {children}

      <CreateTagCategoryModal
        isOpen={tagCategoryCreateOpen}
        onClose={() => setTagCategoryCreateOpen(false)}
      />
      <CreateTagModal
        tagCategory={tagCreateTagCategory}
        onClose={() => setTagCreateTagCategory(null)}
      />
      <DeleteTagModal
        tag={tagForDelete}
        onClose={() => setTagForDelete(null)}
      />
      <DeleteTagCategoryModal
        tagCategory={tagCategoryForDelete}
        onClose={() => setTagCategoryForDelete(null)}
      />
      <MoveTagModal tag={tagForMove} onClose={() => setTagForMove(null)} />
      <EditTagModal tag={tagForEdit} onClose={() => setTagForEdit(null)} />
      <EditTagCategoryModal
        tagCategory={tagCategoryForEdit}
        onClose={() => setTagCategoryForEdit(null)}
      />
    </TagContext.Provider>
  )
}

export const useTagContext = () => useContext(TagContext)
