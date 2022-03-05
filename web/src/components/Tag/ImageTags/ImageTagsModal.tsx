import { Box, Wrap, WrapItem, Flex, Heading, VStack } from '@chakra-ui/react'

import { useMemo } from 'react'
import { TagCategoryItem, TagItem } from 'src/components/Tag/TagItem/TagItem'
import { useTagContext } from 'src/contexts/tags'
import { DefaultSpinner } from 'src/design-system'
import { useMutation } from '@redwoodjs/web'

const ADD_TAG_ON_IMAGE = gql`
  mutation AddTagOnImage($input: TagsOnImageInput!) {
    createTagsOnImage(input: $input) {
      id
      imageId
      tagId
      __typename
    }
  }
`
const REMOVE_TAG_ON_IMAGE = gql`
  mutation RemoveTagOnImage($input: TagsOnImageInput!) {
    deleteTagsOnImage(input: $input) {
      id
    }
  }
`

const ImageTagsModal = ({ image }) => {
  const { tagsQuery } = useTagContext()

  const [createTagsOnImage] = useMutation(ADD_TAG_ON_IMAGE)
  const [deleteTagsOnImage] = useMutation(REMOVE_TAG_ON_IMAGE)

  const handleAddTagOnImage = (imageId, tagId) => {
    createTagsOnImage({
      variables: { input: { imageId, tagId } },
      refetchQueries: ['FindImageWithTagsById'],
    })
  }
  const handleRemoveTagOnImage = (imageId, tagId) => {
    deleteTagsOnImage({
      variables: { input: { imageId, tagId } },
      refetchQueries: ['FindImageWithTagsById'],
    })
  }

  const availableTagCategorys = useMemo(() => {
    return tagsQuery.loading
      ? []
      : tagsQuery.data.tagCategorys.map((tg) => ({
          ...tg,
          tags: tg.tags.filter(
            (tag) => !image.tagsOnImages.find((t) => t.tag.id === tag.id)
          ),
        }))
  }, [image, tagsQuery])

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
              <TagItem
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
        {tagsQuery.loading ? (
          <DefaultSpinner />
        ) : (
          availableTagCategorys.map((tagCategory) => (
            <Box key={tagCategory.id}>
              <Flex mb={2} justify="start">
                <TagCategoryItem tagCategory={tagCategory} showMenu />
              </Flex>
              <Wrap mb={1}>
                {tagCategory.tags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <TagItem
                      tag={tag}
                      onClick={() => handleAddTagOnImage(image.id, tag.id)}
                      actionLabel="Add tag to image"
                      showMenu
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  )
}

export default ImageTagsModal
