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
import { useTagContext } from 'src/contexts/tags'
import {
  MutationapplyManyTagsOnImageArgs,
  MutationapplyTagOnFilterArgs,
} from 'api/types/graphql'
import { useFilterContext } from 'src/contexts/filter'

const APPLY_TAG_ON_SELECTION = gql`
  mutation ApplyTagOnSelection($input: ApplyManyTagsOnImageInput!) {
    applyManyTagsOnImage(input: $input) {
      count
    }
  }
`
const APPLY_TAG_ON_FILTER = gql`
  mutation ApplyTagOnFilter($input: ApplyTagOnFilterInput!) {
    applyTagOnFilter(input: $input) {
      count
    }
  }
`

export enum ApplyTagMode {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
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
    [ApplyTagMode.REMOVE]: 'Tag removed from selected images',
  },
  errorToast: {
    [ApplyTagMode.ADD]: 'Error adding tag to selection',
    [ApplyTagMode.REMOVE]: 'Error removing tag from selection',
  },
  actionLabel: {
    [ApplyTagMode.ADD]: 'Add tag',
    [ApplyTagMode.REMOVE]: 'Remove tag',
  },
  modalTitle: {
    [ApplyTagMode.ADD]: 'Add tag to selected images',
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
}: ApplyTagsModalProps) => {
  const toast = useToast()

  const applyTagOnSelectionMutation = useMutation(APPLY_TAG_ON_SELECTION)
  const applyTagOnFilterMutation = useMutation(APPLY_TAG_ON_FILTER)
  const [applyManyTagsOnImage, { loading: loadingApplySelection }] =
    applyTagOnSelectionMutation
  const [applyTagOnFilter, { loading: loadingApplyFilter }] =
    applyTagOnFilterMutation

  const { selectedImages, allSelected } = useSelectContext()
  const { filter } = useFilterContext()
  const { tagsQuery } = useTagContext()

  useEffect(() => {
    isOpen && !allSelected && selectedImages.length === 0 && onClose()
  }, [isOpen, selectedImages])

  const handleApply = useCallback(
    (tag: Tag) => {
      let promise
      if (allSelected) {
        const input: MutationapplyTagOnFilterArgs['input'] = {
          filter,
          applyMode: applyMode,
          tagId: tag.id,
        }

        promise = applyTagOnFilter({
          variables: { input },
          refetchQueries: ['FindImages'],
        })
      } else {
        const tagsOnImages = selectedImages.map((image) => ({
          imageId: image.id,
          tagId: tag.id,
        }))

        const input: MutationapplyManyTagsOnImageArgs['input'] = {
          tagsOnImages,
          applyMode: applyMode,
        }

        promise = applyManyTagsOnImage({
          variables: { input },
          refetchQueries: ['FindImages'],
        })
      }

      promise
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
      applyTagOnFilter,
      applyManyTagsOnImage,
      allSelected,
      filter,
    ]
  )

  const loadingApply = loadingApplySelection || loadingApplyFilter

  let content
  if (tagsQuery.loading || loadingApply) {
    content = (
      <Center py={2}>
        <Text>{LABELS.loaderLabel[applyMode]}</Text>
        <DefaultSpinner />
      </Center>
    )
  } else if (tagsQuery.data.tagGroups.length === 0) {
    content = (
      <Center py={2}>
        <Text>No tags</Text>
      </Center>
    )
  } else {
    content = (
      <VStack align="start" py={2}>
        {tagsQuery.data.tagGroups.map((tagGroup) => (
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
