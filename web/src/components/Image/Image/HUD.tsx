import { Box, Center, Icon, Fade } from 'src/design-system'
import { useEffect, useState } from 'react'
import {
  EditIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
} from '@chakra-ui/icons'
import { Link, routes, navigate } from '@redwoodjs/router'
import { RightPanelOptions } from 'src/components/Image/Image/RightPanel'

const HUD_TIMEOUT = 2000
export const Hud = ({ imagesAfter, imagesBefore, switchRightPanel }) => {
  const [hudVisible, setHUDVisible] = useState(false)

  useEffect(() => {
    let timeout

    function handleKeyDown(e) {
      switch (e.code) {
        case 'KeyE':
          switchRightPanel(RightPanelOptions.EDIT_TAGS)
          break
        case 'KeyI':
          switchRightPanel(RightPanelOptions.DETAILS)
          break
        case 'Escape':
          navigate(routes.photos())
          break
        case 'ArrowLeft':
          if (imagesBefore && imagesBefore[0])
            navigate(routes.photo({ id: imagesBefore[0].id }))
          break
        case 'ArrowRight':
          if (imagesAfter && imagesAfter[0])
            navigate(routes.photo({ id: imagesAfter[0].id }))
          break
      }
    }
    function handleMouseMove() {
      setHUDVisible(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setHUDVisible(false), HUD_TIMEOUT)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  })

  return (
    <Fade in={hudVisible}>
      <Box position="absolute" top={0} bottom={0} left={0} right={0}>
        <Link to={routes.photos()} title={'Back to gallery'}>
          <Center
            position="absolute"
            top={0}
            left={0}
            width={100}
            height={100}
            opacity={0.7}
            cursor="pointer"
          >
            <Icon as={CloseIcon} color="white" boxSize={8} />
          </Center>
        </Link>

        {imagesBefore && imagesBefore[0] && (
          <Link
            to={routes.photo({ id: imagesBefore[0].id })}
            title={'Previous image'}
          >
            <Center
              position="absolute"
              left={0}
              bottom={0}
              width={100}
              height={100}
              opacity={0.7}
              cursor="pointer"
            >
              <Icon as={ChevronLeftIcon} color="white" boxSize={8} />
            </Center>
          </Link>
        )}

        {imagesAfter && imagesAfter[0] && (
          <Link
            to={routes.photo({ id: imagesAfter[0].id })}
            title={'Next image'}
          >
            <Center
              position="absolute"
              right={0}
              bottom={0}
              width={100}
              height={100}
              opacity={0.7}
              cursor="pointer"
            >
              <Icon as={ChevronRightIcon} color="white" boxSize={8} />
            </Center>
          </Link>
        )}

        <Center
          position="absolute"
          right={0}
          top={0}
          width={120}
          height={100}
          opacity={0.7}
          cursor="pointer"
        >
          <Icon
            as={InfoIcon}
            color="white"
            boxSize={8}
            onClick={() => switchRightPanel(RightPanelOptions.DETAILS)}
            mr={2}
          />
          <Icon
            as={EditIcon}
            color="white"
            boxSize={8}
            onClick={() => switchRightPanel(RightPanelOptions.EDIT_TAGS)}
          />
        </Center>
      </Box>
    </Fade>
  )
}
