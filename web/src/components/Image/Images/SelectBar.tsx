import { ButtonGroup, Flex, Text } from '@chakra-ui/react'
import { useSelectContext, SelectMode } from 'src/contexts/select'
import { MdCheckCircleOutline, MdPlayArrow, MdSelectAll } from 'react-icons/md'
import { MdDeselect } from 'src/design-system/icons'
import { TooltipIconButton } from 'src/design-system'

export const SelectBar = () => {
  const {
    selectedImages,
    selectMode,
    setSelectMode,
    setAllSelected,
    clearSelection,
  } = useSelectContext()
  return (
    <Flex
      borderColor="black"
      py={2}
      bg="white"
      w="100%"
      align="center"
      px={4}
      justify="space-between"
    >
      <ButtonGroup size="xs" isAttached variant="outline">
        <TooltipIconButton
          label="View mode"
          icon={<MdPlayArrow />}
          variant={selectMode === SelectMode.VIEW ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.VIEW)}
        />
        <TooltipIconButton
          icon={<MdCheckCircleOutline />}
          label="Select mode"
          variant={selectMode === SelectMode.MULTI_SELECT ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.MULTI_SELECT)}
        />
      </ButtonGroup>
      {selectMode !== SelectMode.VIEW && (
        <Flex align="center">
          <Text fontSize="sm" ml={2}>
            {selectedImages.length} images selected
          </Text>
          <TooltipIconButton
            label="Deselect all"
            icon={<MdDeselect />}
            onClick={clearSelection}
            size="xs"
            ml={2}
          />
          <TooltipIconButton
            label="Select all"
            icon={<MdSelectAll />}
            onClick={() => setAllSelected(true)}
            size="xs"
            ml={2}
          />
        </Flex>
      )}
    </Flex>
  )
}
