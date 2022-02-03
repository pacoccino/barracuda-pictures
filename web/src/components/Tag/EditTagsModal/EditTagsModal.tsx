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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from 'src/design-system'
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from '@chakra-ui/icons'

import {
  TagGroupItem,
  TagGroupItemNew,
  TagItemNew,
} from 'src/components/Tag/TagItem/TagItem'
import { useState } from 'react'
import type { Tag, TagGroup } from 'types/graphql'

import { CreateTagGroupModal } from 'src/components/Tag/EditTagsModal/CreateTagGroupModal'
import { CreateTagModal } from 'src/components/Tag/EditTagsModal/CreateTagModal'
import { DeleteTagModal } from 'src/components/Tag/EditTagsModal/DeleteTagModal'
import { DeleteTagGroupModal } from 'src/components/Tag/EditTagsModal/DeleteTagGroupModal'
import { EditTagModal } from 'src/components/Tag/EditTagsModal/EditTagModal'
import { EditTagGroupModal } from 'src/components/Tag/EditTagsModal/EditTagGroupModal'

const EditTagsModal = ({ isOpen, onClose, tagGroups }) => {
  const [createTagGroupModalOpen, setCreateTagGroupModalOpen] = useState(false)
  const [tagGroupForCreateTag, setTagGroupForCreateTag] =
    useState<TagGroup | null>(null)
  const [tagGroupForDelete, setTagGroupForDelete] = useState<TagGroup | null>(
    null
  )
  const [tagForDelete, setTagForDelete] = useState<Tag | null>(null)
  const [tagGroupForEdit, setTagGroupForEdit] = useState<TagGroup | null>(null)
  const [tagForEdit, setTagForEdit] = useState<Tag | null>(null)

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
              onClick={() => setCreateTagGroupModalOpen(true)}
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
                  <TagGroupItemNew
                    tagGroup={tagGroup}
                    rightAction={
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<HamburgerIcon />}
                          variant="tagAction"
                          size="xs"
                          p={0}
                        />
                        <MenuList>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => setTagGroupForEdit(tagGroup)}
                          >
                            Edit tag group ...
                          </MenuItem>
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => setTagGroupForDelete(tagGroup)}
                          >
                            Delete tag group ...
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    }
                  />

                  <Button
                    size="xs"
                    colorScheme="blue"
                    variant="solid"
                    leftIcon={<AddIcon />}
                    onClick={() => setTagGroupForCreateTag(tagGroup)}
                    ml={2}
                  >
                    Add tag
                  </Button>
                </Flex>

                <Wrap m={2}>
                  {tagGroup.tags.map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItemNew
                        tag={tag}
                        rightAction={
                          <Menu>
                            <MenuButton
                              as={Icon}
                              aria-label="Options"
                              icon={<HamburgerIcon />}
                              variant="tagAction"
                              size="xs"
                              p={0}
                            />
                            <MenuList>
                              <MenuItem
                                icon={<EditIcon />}
                                onClick={() => setTagForEdit(tag)}
                              >
                                Edit tag ...
                              </MenuItem>
                              <MenuItem
                                icon={<DeleteIcon />}
                                onClick={() => setTagForDelete(tag)}
                              >
                                Delete tag ...
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        }
                      />
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </Box>

          <CreateTagGroupModal
            isOpen={createTagGroupModalOpen}
            onClose={() => setCreateTagGroupModalOpen(false)}
          />
          <CreateTagModal
            tagGroup={tagGroupForCreateTag}
            onClose={() => setTagGroupForCreateTag(null)}
          />
          <DeleteTagModal
            tag={tagForDelete}
            onClose={() => setTagForDelete(null)}
          />
          <DeleteTagGroupModal
            tagGroup={tagGroupForDelete}
            onClose={() => setTagGroupForDelete(null)}
          />
          <EditTagModal tag={tagForEdit} onClose={() => setTagForEdit(null)} />
          <EditTagGroupModal
            tagGroup={tagGroupForEdit}
            onClose={() => setTagGroupForEdit(null)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditTagsModal
