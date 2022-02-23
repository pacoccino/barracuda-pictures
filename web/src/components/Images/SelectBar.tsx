import {
  Button,
  ButtonGroup,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { SelectMode, useSelectContext } from 'src/contexts/select'
import { MdPlayArrow, MdSelectAll } from 'react-icons/md'
import { GrSelect } from 'react-icons/gr'
import { MdDeselect } from 'src/design-system/icons'
import { TooltipIconButton } from 'src/design-system'
import ApplyTagsModal from 'src/components/Tag/ApplyTags/ApplyTagsModal'
import { ApplyTagMode } from 'src/components/Tag/ApplyTags/ApplyTagsModal'
import { useEffect, useRef } from 'react'
import { DeleteImagesModal } from 'src/components/Images/DeleteImagesModal'

export const SelectBar = () => {
  const {
    selectedImages,
    selectMode,
    setSelectMode,
    setAllSelected,
    clearSelection,
    allSelected,
    isSelectionActive,
  } = useSelectContext()
  const ref = useRef(null)

  const applyTagDisclosure = useDisclosure()
  const removeTagDisclosure = useDisclosure()
  const deleteImagesDisclosure = useDisclosure()

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.constructor === HTMLInputElement) return
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
      ref={ref}
    >
      <ButtonGroup size="xs" isAttached variant="outline">
        <Button
          leftIcon={<MdPlayArrow />}
          variant={selectMode === SelectMode.VIEW ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.VIEW)}
          colorScheme="green"
        >
          View Mode
        </Button>
        <Button
          leftIcon={<GrSelect />}
          variant={selectMode === SelectMode.MULTI_SELECT ? 'solid' : 'outline'}
          onClick={() => setSelectMode(SelectMode.MULTI_SELECT)}
          colorScheme="yellow"
        >
          Select Mode
        </Button>
      </ButtonGroup>
      {selectMode !== SelectMode.VIEW && (
        <Flex align="center">
          <Text fontSize="sm" mr={2}>
            {allSelected
              ? 'All images selected'
              : `${selectedImages.length} images selected`}
          </Text>
          <ButtonGroup size="xs" isAttached variant="outline">
            <Button
              variant="solid"
              onClick={applyTagDisclosure.onOpen}
              colorScheme="green"
              disabled={!isSelectionActive}
            >
              Apply tag
            </Button>
            <Button
              variant="solid"
              onClick={removeTagDisclosure.onOpen}
              colorScheme="yellow"
              disabled={!isSelectionActive}
            >
              Remove tag
            </Button>
            <Button
              variant="solid"
              onClick={deleteImagesDisclosure.onOpen}
              colorScheme="red"
              disabled={!isSelectionActive}
            >
              Delete
            </Button>
          </ButtonGroup>
          <TooltipIconButton
            label="Deselect all"
            icon={<MdDeselect />}
            onClick={clearSelection}
            size="xs"
            ml={2}
            disabled={!allSelected && selectedImages.length === 0}
          />
          <TooltipIconButton
            label="Select all"
            icon={<MdSelectAll />}
            onClick={() => setAllSelected(true)}
            disabled={allSelected}
            size="xs"
            ml={2}
          />
        </Flex>
      )}
      <ApplyTagsModal
        isOpen={applyTagDisclosure.isOpen}
        onClose={applyTagDisclosure.onClose}
        applyMode={ApplyTagMode.ADD}
      />
      <ApplyTagsModal
        isOpen={removeTagDisclosure.isOpen}
        onClose={removeTagDisclosure.onClose}
        applyMode={ApplyTagMode.REMOVE}
      />
      <DeleteImagesModal
        isOpen={deleteImagesDisclosure.isOpen}
        onClose={deleteImagesDisclosure.onClose}
      />
    </Flex>
  )
}
