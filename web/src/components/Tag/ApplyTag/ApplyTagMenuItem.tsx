import { useToast } from 'src/design-system'

import { useMutation } from '@redwoodjs/web'
import { Tag } from 'types/graphql'
import { useSelectContext } from 'src/contexts/select'
import { useCallback } from 'react'
import {
  MutationapplyManyTagsOnImageArgs,
  MutationapplyTagOnFilterArgs,
} from 'api/types/graphql'
import { useFilterContext } from 'src/contexts/filter'
import { MenuItem } from '@chakra-ui/react'
import { FaTags } from 'react-icons/fa'
import * as React from 'react'

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

export type ApplyTagMenuItemProps = {
  tag: Tag
  applyMode: ApplyTagMode
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
    [ApplyTagMode.ADD]: 'Apply tag to selection',
    [ApplyTagMode.REMOVE]: 'Unapply tag to selection',
  },
  loaderLabel: {
    [ApplyTagMode.ADD]: 'Applying tag...',
    [ApplyTagMode.REMOVE]: 'Unapplyinh tag...',
  },
}

const ApplyTagMenuItem = ({ applyMode, tag }: ApplyTagMenuItemProps) => {
  const toast = useToast()

  const applyTagOnSelectionMutation = useMutation(APPLY_TAG_ON_SELECTION)
  const applyTagOnFilterMutation = useMutation(APPLY_TAG_ON_FILTER)
  const [applyManyTagsOnImage, { loading: loadingApplySelection }] =
    applyTagOnSelectionMutation
  const [applyTagOnFilter, { loading: loadingApplyFilter }] =
    applyTagOnFilterMutation

  const { selectedImages, allSelected } = useSelectContext()
  const { filter } = useFilterContext()

  const handleApply = useCallback(() => {
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
        toast({
          title: LABELS.successToast[applyMode],
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: LABELS.errorToast[applyMode],
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }, [
    toast,
    applyMode,
    selectedImages,
    applyTagOnFilter,
    applyManyTagsOnImage,
    allSelected,
    filter,
  ])

  const loadingApply = loadingApplySelection || loadingApplyFilter

  return (
    <MenuItem icon={<FaTags />} onClick={() => handleApply()}>
      {loadingApply
        ? LABELS.loaderLabel[applyMode]
        : LABELS.actionLabel[applyMode]}
    </MenuItem>
  )
}

export default ApplyTagMenuItem
