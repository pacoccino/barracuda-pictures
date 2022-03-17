import { IconButton, Flex, Tooltip, Text, Center } from '@chakra-ui/react'
import type { FlexProps } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList } from 'src/design-system'
import { MdMoreVert } from 'react-icons/md'
import * as React from 'react'

export enum TagStatus {
  'positive' = 'positive',
  'disabled' = 'disabled',
  'negative' = 'negative',
}

export type TagProps = FlexProps & {
  name: string
  groupName?: string
  actionLabel?: string
  color?: string
  groupColor?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  menuItems?: React.ReactNode
}

const TagTooltip = ({ label, children }) => (
  <Tooltip label={label} hasArrow isDisabled={!label}>
    {children}
  </Tooltip>
)

export const TagComponent = ({
  name,
  groupName,
  color,
  groupColor,
  leftAction,
  actionLabel,
  onClick,
  menuItems,
  ...args
}: TagProps) => (
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
            <Text color="white" fontSize="0.73rem" fontWeight={600}>
              {groupName}
            </Text>
          </Flex>
        )}
        {leftAction && <Center mr={1}>{leftAction}</Center>}

        <Text color="white" py={1} fontSize="0.73rem" fontWeight={600}>
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
          <MenuList>{menuItems}</MenuList>
        </Menu>
      </Flex>
    )}
  </Flex>
)
