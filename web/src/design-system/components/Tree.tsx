import { Icon, Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { MdFolder } from 'react-icons/md'
import { useCallback, useMemo } from 'react'
import { isEqual } from 'lodash'

type Tree = {
  path: string
  count: number
  children: Tree[]
}

interface TreeProps {
  tree: Tree
  paths: string[]
  selectedPath?: string[]
  onSelect?: (a: string[], b: Tree) => void
}

export const Tree = ({
  tree,
  paths = [],
  selectedPath = null,
  onSelect,
}: TreeProps) => {
  const disclosure = useDisclosure()

  const fullPath = useMemo(() => paths.concat(tree.path), [tree, paths])

  const isSelected = useMemo(() => {
    return isEqual(selectedPath, fullPath)
  }, [selectedPath, fullPath])

  const handleSelect = useCallback(() => {
    onSelect(fullPath, tree)
  }, [onSelect, fullPath, tree])

  return (
    <Box borderTopColor="gray.300" borderTopWidth={paths.length > 0 ? 1 : 0}>
      <Flex
        align="center"
        py={2}
        px={2}
        cursor="pointer"
        onClick={handleSelect}
        _hover={{
          bg: 'gray.200',
        }}
        bg={isSelected ? 'gray.300' : 'gray.100'}
        borderWidth={0}
        borderColor="gray.400"
      >
        {tree.children.length > 0 ? (
          <Box
            onClick={(e) => {
              disclosure.onToggle()
              e.stopPropagation()
            }}
            cursor="pointer"
          >
            {disclosure.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Box>
        ) : (
          <ChevronRightIcon color="gray.400" />
        )}
        <Icon as={MdFolder} ml={1} />
        <Text textStyle="small" ml={2} flex={1}>
          {tree.path}
        </Text>
        <Text textStyle="h3" mr={2}>
          {tree.count}
        </Text>
      </Flex>
      {disclosure.isOpen && (
        <Box ml={2}>
          {tree.children.map((child) => (
            <Tree
              tree={child}
              key={child.path}
              paths={fullPath}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
