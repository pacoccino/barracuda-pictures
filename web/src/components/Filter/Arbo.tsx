import { Box, Text } from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import { DefaultSpinner, Tree } from 'src/design-system'
import S3Path from 'api/src/lib/files/S3Path'
import { useApluContext } from 'src/contexts/aplu'
import moment from 'moment'
import { useMemo } from 'react'

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

  function formatPath(paths: string[], tree: Tree) {
    if (paths.length === 0) {
      return 'All'
    }

    return tree.path
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
        <Tree
          tree={arbo}
          selectedPath={selectedPath}
          onSelect={selectPath}
          formatPath={formatPath}
        />
      </Box>
    </Box>
  )
}

export const ArboDate = () => {
  const {
    filter: { dateRange },
    setDateRange,
  } = useFilterContext()

  const { apluQuery } = useApluContext()

  const selectedPath = useMemo(() => {
    if (!dateRange) return [0]

    const from = moment(dateRange.from)
    const to = moment(dateRange.to)

    if (moment(to).diff(from, 'days') === 1) {
      return [0, from.year(), from.month(), from.date()]
    }
    if (moment(to).diff(from, 'months') === 1) {
      return [0, from.year(), from.month()]
    }
    if (moment(to).diff(from, 'years') === 1) {
      return [0, from.year()]
    }

    return [0]
  }, [dateRange])

  if (apluQuery.loading) {
    return <DefaultSpinner />
  }
  const arbo = apluQuery.data.arbo.arboDate

  const selectDate = (paths, tree) => {
    if (paths.length === 1) {
      setDateRange(null)
      return
    }

    const { date } = tree
    const units = ['year', 'month', 'day']
    const shiftUnit = units[paths.length - 2]

    setDateRange({
      from: moment.utc(date).toISOString(),
      to: moment.utc(date).add(1, shiftUnit).toISOString(),
    })
  }

  function formatPath(paths: string[], tree: Tree) {
    if (paths.length === 0) {
      return 'All'
    }
    if (paths.length === 2) {
      return moment(tree.date).format('MM MMM')
    }
    if (paths.length === 3) {
      return moment(tree.date).format('DD ddd')
    }

    return tree.path
  }

  return (
    <Box
      maxHeight="300px"
      overflowY="scroll"
      px={1}
      borderWidth={1}
      borderColor="gray.600"
      bg="gray.600"
      borderRadius="md"
    >
      <Tree
        tree={arbo}
        selectedPath={selectedPath}
        onSelect={selectDate}
        formatPath={formatPath}
      />
    </Box>
  )
}
