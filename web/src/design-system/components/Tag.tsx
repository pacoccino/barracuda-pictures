import { Flex, Tooltip, Box, Text, Icon } from '@chakra-ui/react'
import type { TagProps as CTagProps } from '@chakra-ui/react'
import { As } from '@chakra-ui/system/dist/declarations/src/system.types'

export enum TagStatus {
  'positive' = 'positive',
  'disabled' = 'disabled',
  'negative' = 'negative',
}

export type TagProps = CTagProps & {
  name: string
  category?: { name: string; color?: string }
  tagLabel?: As
  actionLabel?: string
  actionIcon?: As
  color?: string
  status?: TagStatus
}

const TagTooltip = ({ label, children }) => (
  <Tooltip label={label} hasArrow isDisabled={!label}>
    {children}
  </Tooltip>
)

const STATUS_TO_COLOR = {
  positive: 'blue.300',
  disabled: 'grey.100',
  negative: 'red.600',
}
export const Tag = ({
  name,
  color,
  category,
  actionIcon,
  actionLabel,
  onClick,
  status,
  ...args
}: TagProps) => (
  <TagTooltip label={actionLabel}>
    <Flex
      borderRadius={4}
      borderColor={color + '.500'}
      bg={color + '.500'}
      px={1}
      py={0}
      h={5}
      _hover={onClick && { borderColor: color + '.200' }}
      _active={
        onClick && {
          borderColor: color + '.200',
        }
      }
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'initial'}
      color="white"
      {...args}
    >
      {status && (
        <Icon viewBox="0 0 200 200" color={STATUS_TO_COLOR[status]} mr={1}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      )}

      {category && (
        <Box bg={category.color + '.500'} mr={2} px={1} size="xs">
          <Text fontSize="xs">{category.name}</Text>
        </Box>
      )}

      <Text fontSize={'xs'}>{name}</Text>

      {actionIcon && <Icon boxSize="12px" as={actionIcon} />}
    </Flex>
  </TagTooltip>
)
