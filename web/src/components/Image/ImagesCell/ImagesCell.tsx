import type { FindImages } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Images from 'src/components/Image/Images'
import { Skeleton, Box, Wrap, WrapItem } from '@chakra-ui/react'

export const QUERY = gql`
  query FindImages($filter: ImageFilters!) {
    images(filter: $filter, sorting: { dateTaken: desc }, take: 100) {
      id
      path
      dateTaken
    }
  }
`

export const Loading = () => (
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

export const Empty = () => <Box>No images</Box>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ images }: CellSuccessProps<FindImages>) => {
  return <Images images={images} />
}
