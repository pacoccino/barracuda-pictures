import { Center, Spinner } from '@chakra-ui/react'

export const DefaultSpinner = ({ p = 4 }) => (
  <Center p={p}>
    <Spinner />
  </Center>
)
