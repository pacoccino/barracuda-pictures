import {
  Box,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { useMemo } from 'react'
import { TagItemWithGroup } from 'src/components/Tag/TagItem/TagItem'

const TagsModal = ({
  isOpen,
  onClose,
  image,
  tagGroups,
  handleAddTagOnImage,
  handleRemoveTagOnImage,
}) => {
  const availableTagGroups = useMemo(() => {
    return tagGroups
      .map((tg) => ({
        ...tg,
        tags: tg.tags.filter(
          (tag) => !image.tagsOnImages.find((t) => t.tag.id === tag.id)
        ),
      }))
      .filter((tg) => tg.tags.length !== 0)
  }, [image, tagGroups])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <h3>On Image</h3>
          <Box>
            {image.tagsOnImages.map((tagsOnImage) => (
              <Wrap key={tagsOnImage.id}>
                <WrapItem>
                  <TagItemWithGroup
                    handleAction={() =>
                      handleRemoveTagOnImage(image.id, tagsOnImage.tag.id)
                    }
                    tag={tagsOnImage.tag}
                    actionIcon={DeleteIcon}
                  ></TagItemWithGroup>
                </WrapItem>
              </Wrap>
            ))}
          </Box>
          <h3>Available</h3>

          <Box>
            {availableTagGroups.map((tagGroup) => (
              <Box key={tagGroup.id}>
                <Wrap m={2} spacing={0.5}>
                  {tagGroup.tags.map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItemWithGroup
                        handleAction={() =>
                          handleAddTagOnImage(image.id, tag.id)
                        }
                        tag={tag}
                        actionIcon={AddIcon}
                      ></TagItemWithGroup>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default TagsModal
