import { Box, Wrap, WrapItem, Flex, BodyModal, VStack } from 'src/design-system'

import { TagGroupItemNew, TagItemNew } from 'src/components/Tag/TagItem/TagItem'
import { DefaultSpinner } from 'src/design-system'

const ApplyTagsModal = ({ isOpen, onClose, tagGroups }) => {
  return (
    <BodyModal title="Apply tag on selection" isOpen={isOpen} onClose={onClose}>
      <VStack align="start" py={2}>
        {tagGroups ? (
          tagGroups.map((tagGroup) => (
            <Box key={tagGroup.id}>
              <Flex mb={2} justify="start">
                <TagGroupItemNew tagGroup={tagGroup} />
              </Flex>
              <Wrap mb={1}>
                {tagGroup.tags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <TagItemNew
                      tag={tag}
                      onClick={() => alert(tag.id)}
                      actionLabel="Apply tag"
                    />
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          ))
        ) : (
          <DefaultSpinner />
        )}
      </VStack>
    </BodyModal>
  )
}

export default ApplyTagsModal
