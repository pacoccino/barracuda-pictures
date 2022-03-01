import DateRangePicker from '@wojtekmaj/react-daterange-picker'

import { useFilterContext } from 'src/contexts/filter'
import { Box, Heading } from '@chakra-ui/react'
import { ArboDate } from 'src/components/Filter/Arbo'

export const DatePanel = () => {
  const {
    filter: { dateRange },
    setDateRange,
  } = useFilterContext()

  const onChange = (newValue) => {
    if (newValue && newValue[0] && newValue[1])
      setDateRange({
        from: newValue[0].toISOString(),
        to: newValue[1].toISOString(),
      })
    else setDateRange(null)
  }

  return (
    <Box>
      <Heading textStyle="h3" size="sm" mb={2} flex="1">
        Date Range
      </Heading>
      <DateRangePicker
        width="100%"
        calendarIcon={null}
        onChange={onChange}
        value={dateRange && [dateRange.from, dateRange.to]}
      />
    </Box>
  )
}
