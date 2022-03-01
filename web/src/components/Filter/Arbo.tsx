import { Box, Text } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { DefaultSpinner, Tree } from 'src/design-system'
import S3Path from 'api/src/lib/files/S3Path'
import { useApluContext } from 'src/contexts/aplu'

export const ArboPath = () => {
  const { filter, setPath } = useFilterContext()
  const { apluQuery } = useApluContext()

  if (apluQuery.loading) {
    return <DefaultSpinner />
  }
  const arbo = apluQuery.data.arbo.arboPath

  const selectPath = (paths) => {
    const pathToSelect = paths.slice(1).join('/')
    setPath(pathToSelect)
  }

  const selectedPath = ['/'].concat(S3Path.splitPath(filter.path || ''))

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
        <Tree tree={arbo} selectedPath={selectedPath} onSelect={selectPath} />
      </Box>
    </Box>
  )
}
