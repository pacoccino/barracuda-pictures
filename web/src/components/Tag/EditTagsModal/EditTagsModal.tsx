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
} from 'src/design-system'
import { EditIcon, DeleteIcon, HamburgerIcon } from '@chakra-ui/icons'

import { TagGroupItem, TagItem } from 'src/components/Tag/TagItem/TagItem'
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
            <Heading textStyle="h3" mb={2} flex="1">
              Tags
            </Heading>
            <Button
              onClick={() => setCreateTagGroupModalOpen(true)}
              size="xs"
              colorScheme="blue"
            >
              Create Tag Group
            </Button>
          </Flex>

          <Box>
            {tagGroups.map((tagGroup) => (
              <Box key={tagGroup.id}>
                <Box>
                  <TagGroupItem tagGroup={tagGroup} />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="outline"
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
                </Box>
                <Wrap m={2}>
                  {tagGroup.tags.map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItem tag={tag}></TagItem>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<HamburgerIcon />}
                          variant="outline"
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
                    </WrapItem>
                  ))}
                  <WrapItem>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => setTagGroupForCreateTag(tagGroup)}
                    >
                      Add new tag
                    </Button>
                  </WrapItem>
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
