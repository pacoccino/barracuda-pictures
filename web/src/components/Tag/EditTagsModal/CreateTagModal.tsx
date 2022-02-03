import { Button, Input, Text, useToast, BodyModal } from 'src/design-system'

import { useState } from 'react'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { useMutation } from '@redwoodjs/web'

const CREATE_TAG = gql`
  mutation CreateTag($name: String!, $tagGroupId: String!) {
    createTag(input: { name: $name, tagGroupId: $tagGroupId }) {
      id
      name
      tagGroupId
      __typename
    }
  }
`
export const CreateTagModal = ({ tagGroup, onClose }) => {
  const createTagMutation = useMutation(CREATE_TAG)
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
    <BodyModal
      isOpen={!!tagGroup}
      onClose={onClose}
      title="Create Tag"
      body={
        <>
          <Text>Tag group: {tagGroup?.name}</Text>
          <Input
            type="text"
            placeholder="Tag name"
            onChange={(e) => setTagName(e.target.value)}
          />
          <Button onClick={() => handleCreateTag(tagName)} disabled={loading}>
            Create
          </Button>
        </>
      }
    />
  )
}
