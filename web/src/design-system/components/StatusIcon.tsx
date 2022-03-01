import { Icon } from '@chakra-ui/react'

const STATUS_TO_COLOR = {
  positive: 'blue.300',
  disabled: 'gray.100',
  negative: 'red.600',
}

export const StatusIcon = ({ status }) => (
  <Icon viewBox="25 25 150 150" color={STATUS_TO_COLOR[status]} boxSize={2}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
)
