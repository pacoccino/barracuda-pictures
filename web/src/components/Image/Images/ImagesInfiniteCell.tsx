import type { FindImages } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Images from './Images'
import { Skeleton, Box, Wrap, WrapItem } from '@chakra-ui/react'
import { createInfiniteCell, InfiniteSuccessProps } from 'src/lib/InfiniteCell'

const QUERY = gql`
  query FindImages(
    $filter: ImageFilters!
    $take: Int
    $cursor: String
    $skip: Int
  ) {
    images(
      filter: $filter
      sorting: { dateTaken: desc }
      take: $take
      cursor: $cursor
      skip: $skip
    ) {
      id
      path
      dateTaken
    }
  }
`

const Loading = () => (
  <Wrap m={2} ml={0} spacing={0.5}>
    {[0, 1, 2].map((i) => (
      <WrapItem key={i}>
        <Skeleton>
          <Box h={250} w={250}></Box>
        </Skeleton>
      </WrapItem>
    ))}
  </Wrap>
)

const Empty = () => <Box>No images</Box>

const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

const Success = ({
  items,
  loadMore,
}: InfiniteSuccessProps<FindImages['images'][number]>) => {
  return <Images images={items} loadMore={loadMore} />
}

const ImagesInfiniteCell = createInfiniteCell({
  QUERY,
  Success,
  Failure,
  Empty,
  Loading,
  displayName: 'ImagesInfiniteCell',
  listKey: 'images',
  take: 30,
})

export default ImagesInfiniteCell
