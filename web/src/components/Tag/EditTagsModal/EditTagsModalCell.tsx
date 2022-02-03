import type { ImageAndTags } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EditTagsModal from './EditTagsModal'

export const QUERY = gql`
  query EditTags {
    tagGroups {
      id
      name
      tags {
        id
        name
        tagGroup {
          name
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">{'No tags yet. '}</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

type TagsModalCellProps = {
  isOpen: boolean
  onClose?: () => void
}

export const Success = ({
  tagGroups,
  isOpen,
  onClose,
}: CellSuccessProps<ImageAndTags> & TagsModalCellProps) => {
  return (
    <EditTagsModal tagGroups={tagGroups} isOpen={isOpen} onClose={onClose} />
  )
}
