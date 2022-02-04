import { Center, Spinner } from '@chakra-ui/react'

export const DefaultSpinner = ({ p = 4, ...args }) => (
  <Center p={p}>
    <Spinner {...args} />
  </Center>
)
