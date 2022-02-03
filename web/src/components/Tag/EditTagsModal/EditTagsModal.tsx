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
  Button,
  Flex,
  Heading,
} from 'src/design-system'
import { AddIcon } from '@chakra-ui/icons'

import { TagGroupItemNew, TagItemNew } from 'src/components/Tag/TagItem/TagItem'
import { useTagContext } from 'src/contexts/tags'

export const QUERIES_TO_REFETCH = ['FindTags', 'EditTags', 'ImageAndTags']

const EditTagsModal = ({ isOpen, onClose, tagGroups }) => {
  const { setTagGroupCreateOpen, setTagCreateTagGroup } = useTagContext()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex w="100%">
            <Heading textStyle="h3" mb={2} size="md" flex="1">
              Tags
            </Heading>
            <Button
              onClick={() => setTagGroupCreateOpen(true)}
              leftIcon={<AddIcon />}
              size="xs"
              colorScheme="blue"
              variant="solid"
            >
              Create Tag Group
            </Button>
          </Flex>

          <Box>
            {tagGroups.map((tagGroup) => (
              <Box key={tagGroup.id}>
                <Flex align="start">
                  <TagGroupItemNew tagGroup={tagGroup} />

                  <Button
                    size="xs"
                    colorScheme="blue"
                    variant="solid"
                    leftIcon={<AddIcon />}
                    onClick={() => setTagCreateTagGroup(tagGroup)}
                    ml={2}
                  >
                    Add tag
                  </Button>
                </Flex>

                <Wrap m={2}>
                  {tagGroup.tags.map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItemNew tag={tag} />
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

export default EditTagsModal
