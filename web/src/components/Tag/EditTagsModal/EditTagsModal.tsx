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
  Input,
  Text,
  useToast,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import { TagGroupItem, TagItem } from 'src/components/Tag/TagItem/TagItem'
import { useState } from 'react'
import EditTagsModalCell, {
  QUERY,
} from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { TagGroup } from 'types/graphql'

const CreateTagGroupModal = ({ isOpen, onClose, createTagGroupMutation }) => {
  const [tagGroupName, setTagGroupName] = useState('')
  const toast = useToast()

  const [createTagGroup, { loading }] = createTagGroupMutation
  const handleCreateTagGroup = (name) =>
    createTagGroup({
      variables: { name },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error creating tag group',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag group created completed',
          description: name,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create tag group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="text"
            placeholder="Tag group name"
            onChange={(e) => setTagGroupName(e.target.value)}
          />
          <Button
            onClick={() => handleCreateTagGroup(tagGroupName)}
            disabled={loading}
          >
            Create
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const CreateTagModal = ({ tagGroup, isOpen, onClose, createTagMutation }) => {
  const [tagName, setTagName] = useState('')
  const toast = useToast()

  const [createTag, { loading }] = createTagMutation
  const handleCreateTag = (name) =>
    createTag({
      variables: { name, tagGroupId: tagGroup.id },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error creating tag',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag created completed',
          description: `${tagGroup.name} / ${name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create tag</ModalHeader>
        <ModalCloseButton />
        {tagGroup && (
          <ModalBody>
            <Text>Tag group: {tagGroup.name}</Text>
            <Input
              type="text"
              placeholder="Tag name"
              onChange={(e) => setTagName(e.target.value)}
            />
            <Button onClick={() => handleCreateTag(tagName)} disabled={loading}>
              Create
            </Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

const EditTagsModal = ({
  isOpen,
  onClose,
  tagGroups,
  createTagMutation,
  handleDeleteTag,
  createTagGroupMutation,
  handleDeleteTagGroup,
}) => {
  const [createTagGroupModalOpen, setCreateTagGroupModalOpen] = useState(false)
  const [tagGroupForCreateTag, setTagGroupForCreateTag] =
    useState<TagGroup | null>(null)

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
                <TagGroupItem
                  tagGroup={tagGroup}
                  onClick={() => handleDeleteTagGroup(tagGroup.id)}
                  actionIcon={DeleteIcon}
                  actionLabel="Delete tag group"
                />
                <Wrap m={2}>
                  {tagGroup.tags.map((tag) => (
                    <WrapItem key={tag.id}>
                      <TagItem
                        onClick={() => handleDeleteTag(tag.id)}
                        tag={tag}
                        actionIcon={DeleteIcon}
                        actionLabel="Delete tag"
                      ></TagItem>
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
            createTagGroupMutation={createTagGroupMutation}
          />
          <CreateTagModal
            tagGroup={tagGroupForCreateTag}
            isOpen={!!tagGroupForCreateTag}
            onClose={() => setTagGroupForCreateTag(null)}
            createTagMutation={createTagMutation}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditTagsModal
