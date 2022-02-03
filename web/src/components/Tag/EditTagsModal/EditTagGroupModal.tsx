import { Button, Input, useToast, BodyModal } from 'src/design-system'

import { useEffect, useState } from 'react'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'
import { useMutation } from '@redwoodjs/web'

const UPDATE_TAG_GROUP = gql`
  mutation UpdateTagGroup($name: String!, $tagGroupId: String!) {
    updateTagGroup(id: $tagGroupId, input: { name: $name }) {
      id
      name
      __typename
    }
  }
`
export const EditTagGroupModal = ({ tagGroup, onClose }) => {
  const updagteTagGroupMutation = useMutation(UPDATE_TAG_GROUP)
  const [tagGroupName, setTagGroupName] = useState('')
  const toast = useToast()

  useEffect(() => {
    tagGroup && setTagGroupName(tagGroup.name)
  }, [tagGroup])

  const [updateTagGroup, { loading }] = updagteTagGroupMutation
  const handleUpdateTagGroup = (name) =>
    updateTagGroup({
      variables: { tagGroupId: tagGroup.id, name },
      refetchQueries: [QUERY, 'EditTags'],
    }).then((res) => {
      if (res.error) {
        toast({
          title: 'Error editing tag group',
          description: res.error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Tag group edited',
          description: name,
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
      title="Edit tag group"
      body={
        <>
          <Input
            type="text"
            placeholder="Tag group name"
            onChange={(e) => setTagGroupName(e.target.value)}
            value={tagGroupName}
          />
          <Button
            onClick={() => handleUpdateTagGroup(tagGroupName)}
            disabled={loading}
          >
            Edit
          </Button>
        </>
      }
    />
  )
}
