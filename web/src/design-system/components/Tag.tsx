import { Tooltip, Tag as CTag, TagLabel, TagRightIcon } from '@chakra-ui/react'
import type { TagProps as CTagProps } from '@chakra-ui/react'
import { As } from '@chakra-ui/system/dist/declarations/src/system.types'
import { Icon } from '@chakra-ui/icons'

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
    <CTag
      borderRadius="full"
      variant="solid"
      borderWidth={2}
      borderColor={color + '.500'}
      colorScheme={color}
      _hover={onClick && { borderColor: color + '.200' }}
      _active={
        onClick && {
          borderColor: color + '.200',
        }
      }
      onClick={onClick}
      cursor={onClick ? 'pointer' : undefined}
      {...args}
    >
      {status && (
        <Icon viewBox="0 0 200 200" color={STATUS_TO_COLOR[status]}>
          <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
          />
        </Icon>
      )}
      {category && (
        <CTag
          borderRadius="full"
          variant="solid"
          colorScheme={category.color}
          mr={2}
        >
          <TagLabel>{category.name}</TagLabel>
        </CTag>
      )}
      <TagLabel>{name}</TagLabel>
      {actionIcon && <TagRightIcon boxSize="12px" as={actionIcon} />}
    </CTag>
  </TagTooltip>
)
