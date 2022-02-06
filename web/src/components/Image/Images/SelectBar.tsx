import {
  Button,
  ButtonGroup,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { SelectMode, useSelectContext } from 'src/contexts/select'
import { MdCheckCircleOutline, MdPlayArrow, MdSelectAll } from 'react-icons/md'
import { MdDeselect } from 'src/design-system/icons'
import { TooltipIconButton } from 'src/design-system'
import ApplyTagsModalCell from 'src/components/Tag/ApplyTagsModal/ApplyTagsModalCell'
import { ApplyTagMode } from 'src/components/Tag/ApplyTagsModal/ApplyTagsModal'
import { useEffect } from 'react'

export const SelectBar = () => {
  const {
    selectedImages,
    selectMode,
    setSelectMode,
    setAllSelected,
    clearSelection,
  } = useSelectContext()

  const applyTagDisclosure = useDisclosure()
  const removeTagDisclosure = useDisclosure()

  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.code) {
        case 'KeyV':
          setSelectMode(SelectMode.VIEW)
          break
        case 'KeyD':
          clearSelection()
          break
        case 'KeyZ':
          applyTagDisclosure.onToggle()
          break
        case 'KeyX':
          removeTagDisclosure.onToggle()
          break
        case 'KeyS':
          setSelectMode(SelectMode.MULTI_SELECT)
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

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
          <Text fontSize="sm" mr={2}>
            {selectedImages.length} images selected
          </Text>
          <ButtonGroup size="xs" isAttached variant="outline">
            <Button
              variant="solid"
              onClick={applyTagDisclosure.onOpen}
              colorScheme="green"
              disabled={selectedImages.length === 0}
            >
              Apply tag
            </Button>
            <Button
              variant="solid"
              onClick={removeTagDisclosure.onOpen}
              colorScheme="red"
              disabled={selectedImages.length === 0}
            >
              Remove tag
            </Button>
          </ButtonGroup>
          <TooltipIconButton
            label="Deselect all"
            icon={<MdDeselect />}
            onClick={clearSelection}
            size="xs"
            ml={2}
            disabled={selectedImages.length === 0}
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
      <ApplyTagsModalCell
        isOpen={applyTagDisclosure.isOpen}
        onClose={applyTagDisclosure.onClose}
        applyMode={ApplyTagMode.ADD}
      />
      <ApplyTagsModalCell
        isOpen={removeTagDisclosure.isOpen}
        onClose={removeTagDisclosure.onClose}
        applyMode={ApplyTagMode.REMOVE}
      />
    </Flex>
  )
}
