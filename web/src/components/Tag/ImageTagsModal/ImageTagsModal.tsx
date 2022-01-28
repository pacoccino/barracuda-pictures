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
  Heading,
  Button,
  Flex,
  VStack,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { useMemo, useState } from 'react'
import {
  TagGroupItem,
  TagItem,
  TagItemWithGroup,
} from 'src/components/Tag/TagItem/TagItem'
import EditTagsModalCell from 'src/components/Tag/EditTagsModalCell/EditTagsModalCell'
import { TagStatus } from 'src/design-system/components/Tag'

const ImageTagsModal = ({
  isOpen,
  onClose,
  image,
  tagGroups,
  handleAddTagOnImage,
  handleRemoveTagOnImage,
}) => {
  const [editTagOpen, setEditTagOpen] = useState(false)

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
        <ModalHeader>Edit image tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex w="100%">
            <Box flex="1" />
            <Button
              onClick={() => setEditTagOpen(true)}
              size="xs"
              colorScheme="blue"
            >
              Edit tags
            </Button>
            <EditTagsModalCell
              isOpen={editTagOpen}
              onClose={() => setEditTagOpen(false)}
            />
          </Flex>
          <h3>On Image</h3>
          <Box>
            {image.tagsOnImages.map((tagsOnImage) => (
              <Wrap key={tagsOnImage.id}>
                <WrapItem>
                  <TagItemWithGroup
                    onClick={() =>
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
            <VStack>
              {availableTagGroups.map((tagGroup) => (
                <Box key={tagGroup.id}>
                  <TagGroupItem tagGroup={tagGroup} />
                  <Wrap m={2}>
                    {tagGroup.tags.map((tag) => (
                      <WrapItem key={tag.id}>
                        <TagItem
                          tag={tag}
                          onClick={() => handleAddTagOnImage(image.id, tag.id)}
                          actionIcon={AddIcon}
                          actionLabel="Add tag"
                        />
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              ))}
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ImageTagsModal
