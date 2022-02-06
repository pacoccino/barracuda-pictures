import {
  Box,
  Wrap,
  WrapItem,
  Flex,
  BodyModal,
  VStack,
  useToast,
  Text,
  Center,
} from 'src/design-system'

import { TagGroupItemNew, TagItemNew } from 'src/components/Tag/TagItem/TagItem'
import { DefaultSpinner } from 'src/design-system'
import { useMutation } from '@redwoodjs/web'
import { Tag } from 'types/graphql'
import { useSelectContext } from 'src/contexts/select'
import { useCallback } from 'react'

const APPLY_TAG_ON_SELECTION = gql`
  mutation ApplyTagOnSelection($input: [TagsOnImageInput!]!) {
    createManyTagsOnImage(input: $input) {
      count
    }
  }
`
const ApplyTagsModal = ({ isOpen, onClose, tagGroups }) => {
  const toast = useToast()
  const applyTagOnSelection = useMutation(APPLY_TAG_ON_SELECTION)
  const [createManyTagsOnImage, { loading }] = applyTagOnSelection

  const { selectedImages } = useSelectContext()

  const handleApply = useCallback(
    (tag: Tag) => {
      const input = selectedImages.map((image) => ({
        imageId: image.id,
        tagId: tag.id,
      }))

      createManyTagsOnImage({
        variables: { input },
      })
        .then(() => {
          onClose()
          toast({
            title: 'Tag applied to selection',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
        .catch((error) => {
          toast({
            title: 'Error applying tag',
            description: error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        })
    },
    [selectedImages]
  )

  let content
  if (loading) {
    content = (
      <Center py={2}>
        <Text>Applying tag on selection...</Text>
        <DefaultSpinner />
      </Center>
    )
  } else if (!tagGroups) {
    content = (
      <Center py={2}>
        <Text>No tags</Text>
      </Center>
    )
  } else {
    content = (
      <VStack align="start" py={2}>
        {tagGroups.map((tagGroup) => (
          <Box key={tagGroup.id}>
            <Flex mb={2} justify="start">
              <TagGroupItemNew tagGroup={tagGroup} />
            </Flex>
            <Wrap mb={1}>
              {tagGroup.tags.map((tag) => (
                <WrapItem key={tag.id}>
                  <TagItemNew
                    tag={tag}
                    onClick={() => handleApply(tag)}
                    actionLabel="Apply tag"
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    )
  }
  return (
    <BodyModal title="Apply tag on selection" isOpen={isOpen} onClose={onClose}>
      {content}
    </BodyModal>
  )
}

export default ApplyTagsModal
