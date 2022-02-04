import {
  Box,
  Wrap,
  WrapItem,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  VStack,
} from '@chakra-ui/react'

import { useMemo } from 'react'
import { TagGroupItemNew, TagItemNew } from 'src/components/Tag/TagItem/TagItem'

const ImageTagsModal = ({
  image,
  tagGroups,
  handleAddTagOnImage,
  handleRemoveTagOnImage,
}) => {
  const availableTagGroups = useMemo(() => {
    return tagGroups.map((tg) => ({
      ...tg,
      tags: tg.tags.filter(
        (tag) => !image.tagsOnImages.find((t) => t.tag.id === tag.id)
      ),
    }))
  }, [image, tagGroups])

  return (
    <Box>
      <Heading textStyle="h3" size="sm" mb={2}>
        Edit image tags
      </Heading>
      <Heading textStyle="h3" size="sm" mb={2}>
        On Image
      </Heading>
      <Wrap mb={2}>
        {image.tagsOnImages
          .map((ti) => ti.tag)
          .map((tag) => (
            <WrapItem key={tag.id}>
              <TagItemNew
                tag={tag}
                onClick={() => handleRemoveTagOnImage(image.id, tag.id)}
                actionLabel="Remove tag from image"
                showGroup
              />
            </WrapItem>
          ))}
      </Wrap>

      <Heading textStyle="h3" size="sm" mb={2}>
        Available
      </Heading>
      <VStack align="start">
        {availableTagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <Flex mb={2} justify="start">
              <TagGroupItemNew tagGroup={tagGroup} showMenu />
            </Flex>
            <Wrap mb={1}>
              {tagGroup.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <TagItemNew
                    tag={tag}
                    onClick={() => handleAddTagOnImage(image.id, tag.id)}
                    actionLabel="Add tag to image"
                    showMenu
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default ImageTagsModal
