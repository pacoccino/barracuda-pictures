import {
  Button,
  ButtonGroup,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useSelectContext } from 'src/contexts/select'
import { MdSelectAll } from 'react-icons/md'
import { MdDeselect } from 'src/design-system/icons'
import { TooltipIconButton } from 'src/design-system'
import ApplyTagModal from 'src/components/Tag/ApplyTag/ApplyTagModal'
import { ApplyTagMode } from 'src/components/Tag/ApplyTag/ApplyTagModal'
import { useEffect, useRef } from 'react'
import { DeleteImagesModal } from 'src/components/Images/DeleteImagesModal'
import { EditBasePathModal } from 'src/components/Images/EditBasePathModal'

export const SelectBar = () => {
  const {
    selectedImages,
    setAllSelected,
    clearSelection,
    allSelected,
    isSelectionActive,
  } = useSelectContext()
  const ref = useRef(null)

  const applyTagDisclosure = useDisclosure()
  const removeTagDisclosure = useDisclosure()
  const editBasePathDisclosure = useDisclosure()
  const deleteImagesDisclosure = useDisclosure()

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.constructor === HTMLInputElement) return
      switch (e.code) {
        case 'KeyD':
          clearSelection()
          break
        case 'KeyZ':
          applyTagDisclosure.onToggle()
          break
        case 'KeyX':
          removeTagDisclosure.onToggle()
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
      <Flex align="center">
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
          <Button
            variant="solid"
            onClick={editBasePathDisclosure.onOpen}
            colorScheme="blue"
            disabled={!isSelectionActive}
          >
            Path
          </Button>
        </ButtonGroup>
        <TooltipIconButton
          label="Deselect all"
          icon={<MdDeselect />}
          onClick={clearSelection}
          size="xs"
          ml={2}
          disabled={!isSelectionActive}
        />
        <TooltipIconButton
          label="Select all"
          icon={<MdSelectAll />}
          onClick={() => setAllSelected(true)}
          disabled={allSelected}
          size="xs"
          ml={2}
        />

        <Text fontSize="sm" ml={2}>
          {allSelected
            ? `All images from filter selected`
            : `${selectedImages.length || 'No'} images selected`}
        </Text>
      </Flex>
      <EditBasePathModal
        isOpen={editBasePathDisclosure.isOpen}
        onClose={editBasePathDisclosure.onClose}
      />
      <ApplyTagModal
        isOpen={applyTagDisclosure.isOpen}
        onClose={applyTagDisclosure.onClose}
        applyMode={ApplyTagMode.ADD}
      />
      <ApplyTagModal
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
