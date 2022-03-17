import {
  Box,
  Center,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useFilterContext } from 'src/contexts/filter'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, MenuList } from 'src/design-system'
import { TagCategoryMenuItems, TagMenuItems } from 'src/components/Tag/TagItem'
import { FaTags } from 'react-icons/fa'
import { MdGroup, MdMoreVert } from 'react-icons/md'
import ApplyTagMenuItem, {
  ApplyTagMode,
} from 'src/components/Tag/ApplyTag/ApplyTagMenuItem'
import { useSelectContext } from 'src/contexts/select'

const RowMenu = ({ children }) => (
  <Menu placement="right">
    <MenuButton
      as={IconButton}
      icon={<MdMoreVert size={16} />}
      aria-label="Options"
      color="gray.800"
      variant="ghost"
      _hover={{ bg: 'gray.400' }}
      borderRadius={0}
      size="sm"
      minWidth="initial"
      width={6}
    />
    <MenuList>{children}</MenuList>
  </Menu>
)

const TagRow = ({ tag, tagCategory }) => {
  const { selectedTagIds, addTagToFilter, removeTagToFilter } =
    useFilterContext()
  const { isSelectionActive } = useSelectContext()

  const isTagSelected = useMemo(
    () => selectedTagIds.indexOf(tag.id) !== -1,
    [tag, selectedTagIds]
  )
  const switchSelection = useCallback(
    (e) => {
      isTagSelected
        ? removeTagToFilter(tag, tagCategory)
        : addTagToFilter(tag, tagCategory)
      e && e.preventDefault()
      e && e.stopPropagation()
    },
    [isTagSelected, tag, tagCategory, removeTagToFilter, addTagToFilter]
  )

  return (
    <Flex
      align="stretch"
      bg={'gray.200'}
      borderWidth={0}
      borderColor="gray.400"
    >
      <Flex
        align="center"
        cursor="pointer"
        py={2}
        px={2}
        flex={1}
        _hover={{
          bg: 'gray.100',
        }}
        onClick={switchSelection}
      >
        <Checkbox
          isChecked={isTagSelected}
          onChange={switchSelection}
          bg="white"
          mr={2}
        />

        <Text textStyle="small" flex={1}>
          {tag.name}
        </Text>
      </Flex>
      <RowMenu>
        {isSelectionActive && (
          <>
            <ApplyTagMenuItem tag={tag} applyMode={ApplyTagMode.ADD} />
            <ApplyTagMenuItem tag={tag} applyMode={ApplyTagMode.REMOVE} />
          </>
        )}

        <TagMenuItems tag={tag} />
      </RowMenu>
    </Flex>
  )
}

const TagCategoryIcon = ({ tagCategory }) => {
  if (tagCategory.type === 'PERSON') {
    return <Icon as={MdGroup} />
  } else {
    return <Icon as={FaTags} />
  }
}

const TagCategoryRow = ({ tagCategory }) => {
  const disclosure = useDisclosure({ defaultIsOpen: true })

  const { tagListConditions, setTagListCondition } = useFilterContext()

  return (
    <Box borderTopColor="gray.300">
      <Flex
        align="stretch"
        bg={'gray.100'}
        borderWidth={0}
        borderColor="gray.400"
      >
        <Flex
          align="center"
          py={2}
          px={2}
          flex={1}
          _hover={{
            bg: 'gray.200',
          }}
          cursor="pointer"
          onClick={(e) => {
            disclosure.onToggle()
            e.stopPropagation()
          }}
        >
          {tagCategory.tags.length > 0 ? (
            <Box cursor="pointer">
              {disclosure.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Box>
          ) : (
            <ChevronRightIcon color="gray.400" />
          )}

          <Center ml={1}>
            <TagCategoryIcon tagCategory={tagCategory} />
          </Center>
          <Text textStyle="small" ml={2} flex={1}>
            {tagCategory.name}
          </Text>
        </Flex>
        <Flex>
          <Flex align="center" px={1}>
            <Text fontSize="sm">
              {tagListConditions[tagCategory.id] || 'OR'}
            </Text>
            <Switch
              isChecked={tagListConditions[tagCategory.id] === 'AND'}
              onChange={() =>
                setTagListCondition(
                  tagCategory,
                  tagListConditions[tagCategory.id] === 'AND' ? 'OR' : 'AND'
                )
              }
              ml={2}
              size="sm"
            />
          </Flex>
          <RowMenu>
            <TagCategoryMenuItems tagCategory={tagCategory} />
          </RowMenu>
        </Flex>
      </Flex>

      {disclosure.isOpen && (
        <Box ml={2}>
          {tagCategory.tags.map((tag) => (
            <TagRow tag={tag} tagCategory={tagCategory} key={tag.id} />
          ))}
        </Box>
      )}
    </Box>
  )
}

const TagsList = ({ tagCategorys }) => {
  if (tagCategorys.length === 0) return <Center py={4}>No tags</Center>

  return (
    <Box
      maxHeight="500px"
      maxWidth="100%"
      overflow="auto"
      px={1}
      borderWidth={1}
      borderColor="gray.600"
      bg="gray.600"
      borderRadius="md"
    >
      {tagCategorys.map((tagCategory) => (
        <TagCategoryRow tagCategory={tagCategory} key={tagCategory.id} />
      ))}
    </Box>
  )
}

export { TagsList }
