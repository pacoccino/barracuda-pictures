import type { FindImages } from 'types/graphql'
import type { CellFailureProps } from '@redwoodjs/web'

import Images from './Images'
import { Skeleton, Box, Wrap, WrapItem, Center } from '@chakra-ui/react'
import { createInfiniteCell, InfiniteSuccessProps } from 'src/lib/InfiniteCell'

const QUERY = gql`
  query FindImages(
    $filter: ImageFilters!
    $take: Int
    $cursor: String
    $skip: Int
  ) {
    imagesInfinite: moreImages(
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

export const beforeQuery = (props) => {
  return {
    variables: props,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  }
}

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

const Empty = () => <Center p={8}>No images</Center>

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
  beforeQuery,
  displayName: 'ImagesInfiniteCell',
  listKey: 'imagesInfinite',
  take: 30,
})

export default ImagesInfiniteCell
