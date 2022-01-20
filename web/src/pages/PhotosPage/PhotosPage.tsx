import { MetaTags } from '@redwoodjs/web'
import ImagesCell from 'src/components/Image/ImagesCell'
import TagsCell from 'src/components/Tag/TagsCell'
import { HStack, Box } from '@chakra-ui/react'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>Photos</h1>

      <HStack>
        <Box w={200}>
          <TagsCell />
        </Box>
        <Box>
          <ImagesCell />
        </Box>
      </HStack>
    </>
  )
}

export default HomePage
