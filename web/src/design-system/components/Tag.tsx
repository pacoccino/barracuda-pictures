import {
  IconButton,
  Flex,
  Tooltip,
  Box,
  Text,
  Icon,
  Center,
} from '@chakra-ui/react'
import type { TagProps as CTagProps } from '@chakra-ui/react'
import type { FlexProps } from '@chakra-ui/react'
import { As } from '@chakra-ui/system/dist/declarations/src/system.types'
import { Menu, MenuButton, MenuItem, MenuList } from 'src/design-system'
import { MdMoreVert } from 'react-icons/md'

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

export type TagNewProps = FlexProps & {
  name: string
  groupName: string
  actionLabel?: string
  color?: string
  groupColor?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  menuItems?: {
    onClick: () => void
    icon: React.ReactNode
    label: string
  }[]
}

const TagTooltip = ({ label, children }) => (
  <Tooltip label={label} hasArrow isDisabled={!label}>
    {children}
  </Tooltip>
)

const STATUS_TO_COLOR = {
  positive: 'blue.300',
  disabled: 'gray.100',
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
      align="center"
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

      {actionIcon && <Icon boxSize="10px" ml={1} as={actionIcon} />}
    </Flex>
  </TagTooltip>
)

export const TagNew = ({
  name,
  groupName,
  color,
  groupColor,
  leftAction,
  actionLabel,
  onClick,
  menuItems,
  ...args
}: TagNewProps) => (
  <Flex borderRadius={4} bg={color + '.500'} align="stretch" {...args}>
    <TagTooltip label={actionLabel}>
      <Flex
        align="center"
        cursor={onClick ? 'pointer' : 'initial'}
        onClick={onClick}
        _hover={onClick && { bg: color + '.400' }}
        pr={menuItems ? 1 : 1}
        pl={groupName ? 0 : 1}
        borderRadius={4}
      >
        {groupName && (
          <Flex
            bg={groupColor + '.500'}
            borderRadius={4}
            align="center"
            px={1}
            mr={1}
            height="100%"
          >
            <Text color="white" fontSize="0.7rem">
              {groupName}
            </Text>
          </Flex>
        )}
        {leftAction && <Center>{leftAction}</Center>}

        <Text color="white" py={1} fontSize="0.7rem">
          {name}
        </Text>
      </Flex>
    </TagTooltip>

    {menuItems && (
      <Flex align="center">
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MdMoreVert />}
            aria-label="Options"
            color="white"
            variant="ghost"
            _hover={{ bg: 'gray.500' }}
            borderRadius={4}
            size="xs"
            minWidth="initial"
            height="100%"
          />
          <MenuList>
            {menuItems.map((menuItem) => (
              <MenuItem
                key={menuItem.label}
                icon={menuItem.icon}
                onClick={menuItem.onClick}
              >
                {menuItem.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    )}
  </Flex>
)
