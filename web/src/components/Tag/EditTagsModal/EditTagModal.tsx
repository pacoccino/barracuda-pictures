import { Button, Input, Text, useToast, BodyModal } from 'src/design-system'

import { useEffect, useState } from 'react'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { useMutation } from '@redwoodjs/web'

const UPDATE_TAG = gql`
  mutation UpdateTag($name: String!, $tagId: String!) {
    updateTag(id: $tagId, input: { name: $name }) {
      id
      name
      tagGroupId
      __typename
    }
  }
`
export const EditTagModal = ({ tag, onClose }) => {
  const updateTagMutation = useMutation(UPDATE_TAG)
  const [tagName, setTagName] = useState('')
  const toast = useToast()

  useEffect(() => {
    tag && setTagName(tag.name)
  }, [tag])

  const [updateTag, { loading }] = updateTagMutation
  const handleUpdateTag = (name) =>
    updateTag({
      variables: { name, tagId: tag.id },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error editing tag',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag edited',
          description: `${tag.tagGroup.name} / ${name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        onClose()
      }
    })

  return (
    <BodyModal
      isOpen={!!tag}
      onClose={onClose}
      title="Edit Tag"
      body={
        <>
          <Text>Tag group: {tag?.tagGroup?.name}</Text>
          <Input
            type="text"
            placeholder="Tag name"
            onChange={(e) => setTagName(e.target.value)}
            value={tagName}
          />
          <Button onClick={() => handleUpdateTag(tagName)} disabled={loading}>
            Edit
          </Button>
        </>
      }
    />
  )
}
