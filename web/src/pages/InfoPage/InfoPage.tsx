import { MetaTags } from '@redwoodjs/web'
import { Heading, Center, Text, VStack } from '@chakra-ui/react'

const InfoPage = () => {
  return (
    <>
      <MetaTags title="Infos" description="Info page" />

      <Center py={4}>
        <VStack>
          <Heading as="h2" textAlign="center">
            Infos
          </Heading>

          <Text>
            <Text as="kbd">E</Text> Edit image tags
          </Text>
          <Text>
            <Text as="kbd">G</Text> Go to gallery
          </Text>
          <Text>
            <Text as="kbd">I</Text> View image info
          </Text>
          <Text>
            <Text as="kbd">V</Text> View mode
          </Text>
          <Text>
            <Text as="kbd">S</Text> Select Mode
          </Text>
          <Text>
            <Text as="kbd">D</Text> Deselect
          </Text>
          <Text>
            <Text as="kbd">W</Text> Apply tag
          </Text>
          <Text>
            <Text as="kbd">X</Text> Remove tag
          </Text>
        </VStack>
      </Center>
    </>
  )
}

export default InfoPage
