import type { FindTags } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tags from 'src/components/Tag/Tags'

export const QUERY = gql`
  query FindTags {
    tagGroups {
      id
      name
      tags {
        id
        name
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

export const Success = ({ tagGroups }: CellSuccessProps<FindTags>) => {
  return <Tags tagGroups={tagGroups} />
}
