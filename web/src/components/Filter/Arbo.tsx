import { Icon, Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { MdFolder } from 'react-icons/md'
import { useFilterContext } from 'src/contexts/filter'
import { useCallback, useMemo } from 'react'
import { isEqual } from 'lodash'
import S3Path from 'api/src/lib/files/S3Path'

const ArboRecursive = ({ arbo, paths = [] }) => {
  const disclosure = useDisclosure()
  const { filter, setPath } = useFilterContext()

  const fullPath = useMemo(() => paths.concat(arbo.path), [arbo, paths])

  const isArboSelected = useMemo(() => {
    const selectedPaths = S3Path.splitPath(filter.path || '')
    const currentArbo = fullPath.slice(1)

    return isEqual(selectedPaths, currentArbo)
  }, [filter, fullPath])

  const onSelectArbo = useCallback(() => {
    const pathToSelect = fullPath.slice(1).join('/')
    setPath(pathToSelect)
  }, [fullPath, setPath])

  return (
    <Box borderTopColor="gray.300" borderTopWidth={paths.length > 0 ? 1 : 0}>
      <Flex
        align="center"
        py={2}
        px={2}
        cursor="pointer"
        onClick={onSelectArbo}
        _hover={{
          bg: 'gray.200',
        }}
        bg={isArboSelected ? 'gray.300' : 'gray.100'}
        borderWidth={0}
        borderColor="gray.400"
      >
        {arbo.children.length > 0 ? (
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
          {arbo.path}
        </Text>
        <Text textStyle="h3" mr={2}>
          {arbo.count}
        </Text>
      </Flex>
      {disclosure.isOpen && (
        <Box ml={2}>
          {arbo.children.map((child) => (
            <ArboRecursive arbo={child} key={child.path} paths={fullPath} />
          ))}
        </Box>
      )}
    </Box>
  )
}
export const Arbo = ({ arbo, paths = [] }) => {
  return (
    <Box>
      <Text align="center" mb={1}>
        Folders
      </Text>
      <Box
        maxHeight="300px"
        overflowY="scroll"
        px={1}
        borderWidth={1}
        borderColor="gray.600"
        bg="gray.600"
        borderRadius="md"
      >
        <ArboRecursive arbo={arbo} paths={paths} />
      </Box>
    </Box>
  )
}
