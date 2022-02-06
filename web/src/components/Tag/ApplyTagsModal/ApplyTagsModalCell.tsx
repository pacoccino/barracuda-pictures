import type { FindTags } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ApplyTagsModal from './ApplyTagsModal'

import { QUERY as QQ } from 'src/components/Filter/FilterPanelCell'
export const QUERY = QQ

export const Loading = ({ onClose, isOpen }) => (
  <ApplyTagsModal isOpen={isOpen} onClose={onClose} />
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

type ApplyTagsModalCellProps = {
  isOpen: boolean
  onClose?: () => void
}

export const Success = ({
  tagGroups,
  onClose,
  isOpen,
}: CellSuccessProps<FindTags> & ApplyTagsModalCellProps) => {
  return (
    <ApplyTagsModal tagGroups={tagGroups} isOpen={isOpen} onClose={onClose} />
  )
}
