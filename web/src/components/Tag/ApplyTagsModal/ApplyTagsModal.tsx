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
import { Tag, TagGroup } from 'types/graphql'
import { useSelectContext } from 'src/contexts/select'
import { useCallback, useEffect } from 'react'

const ADD_TAG_ON_SELECTION = gql`
  mutation AddTagOnSelection($input: [TagsOnImageInput!]!) {
    createManyTagsOnImage(input: $input) {
      count
    }
  }
`
const REMOVE_TAG_ON_SELECTION = gql`
  mutation RemoveTagOnSelection($input: [TagsOnImageInput!]!) {
    deleteManyTagsOnImage(input: $input) {
      count
    }
  }
`

export enum ApplyTagMode {
  ADD,
  REMOVE,
}

export type ApplyTagsModalProps = {
  isOpen: boolean
  onClose?: () => void
  applyMode: ApplyTagMode
  tagGroups: TagGroup[]
}

const LABELS = {
  successToast: {
    [ApplyTagMode.ADD]: 'Tag added to selected images',
    [ApplyTagMode.REMOVE]: 'Tag removed selected images',
  },
  errorToast: {
    [ApplyTagMode.ADD]: 'Error adding tag to selection',
    [ApplyTagMode.REMOVE]: 'Error removing tag from selection',
  },
  actionLabel: {
    [ApplyTagMode.ADD]: 'Apply tag',
    [ApplyTagMode.REMOVE]: 'Remove tag',
  },
  modalTitle: {
    [ApplyTagMode.ADD]: 'Apply tag to selected images',
    [ApplyTagMode.REMOVE]: 'Remove tag from selected images',
  },
  loaderLabel: {
    [ApplyTagMode.ADD]: 'Applying tag on selection...',
    [ApplyTagMode.REMOVE]: 'Removing tag on selection...',
  },
}
const ApplyTagsModal = ({
  applyMode,
  isOpen,
  onClose,
  tagGroups,
}: ApplyTagsModalProps) => {
  const toast = useToast()
  const addTagOnSelection = useMutation(ADD_TAG_ON_SELECTION)
  const removeTagOnSelection = useMutation(REMOVE_TAG_ON_SELECTION)
  const [createManyTagsOnImage, { loading: loadingAdd }] = addTagOnSelection
  const [deleteManyTagsOnImage, { loading: loadingRemove }] =
    removeTagOnSelection

  const { selectedImages } = useSelectContext()

  useEffect(() => {
    isOpen && selectedImages.length === 0 && onClose()
  }, [isOpen, selectedImages])

  const handleApply = useCallback(
    (tag: Tag) => {
      const input = selectedImages.map((image) => ({
        imageId: image.id,
        tagId: tag.id,
      }))

      let action
      if (applyMode === ApplyTagMode.ADD) action = createManyTagsOnImage
      if (applyMode === ApplyTagMode.REMOVE) action = deleteManyTagsOnImage

      if (!action) throw new Error('invalid ApplyTagMode action')

      action({
        variables: { input },
        refetchQueries: ['FindImages'],
      })
        .then(() => {
          onClose()
          toast({
            title: LABELS.successToast[applyMode],
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        })
        .catch((error) => {
          toast({
            title: LABELS.errorToast[applyMode],
            description: error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        })
    },
    [
      toast,
      onClose,
      applyMode,
      selectedImages,
      createManyTagsOnImage,
      deleteManyTagsOnImage,
    ]
  )

  let content
  if (loadingAdd || loadingRemove) {
    content = (
      <Center py={2}>
        <Text>{LABELS.loaderLabel[applyMode]}</Text>
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
                    actionLabel={LABELS.actionLabel[applyMode]}
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
    <BodyModal
      title={LABELS.modalTitle[applyMode]}
      isOpen={isOpen}
      onClose={onClose}
    >
      {content}
    </BodyModal>
  )
}

export default ApplyTagsModal
