import { Button, ButtonGroup, Flex, IconButton, Text } from '@chakra-ui/react'
import { useSelectContext, SelectMode } from 'src/contexts/select'
import { MdCheckCircleOutline, MdPlayArrow } from 'react-icons/md'

export const SelectBar = () => {
  const { selectedImages, selectMode, setSelectMode, clearSelection } =
    useSelectContext()
  return (
    <Flex borderColor="black" py={2} bg="white" w="100%" align="center" px={4}>
      <ButtonGroup size="xs" isAttached variant="outline">
        <IconButton
          icon={<MdPlayArrow />}
          variant={selectMode === SelectMode.VIEW ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.VIEW)}
        />
        <IconButton
          icon={<MdCheckCircleOutline />}
          variant={selectMode === SelectMode.MULTI_SELECT ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.MULTI_SELECT)}
        />
      </ButtonGroup>
      <Text fontSize="sm" ml={2}>
        {selectedImages.length} images selected
      </Text>
      <Button onClick={clearSelection} size="xs" ml={2}>
        Clear selection
      </Button>
    </Flex>
  )
}
