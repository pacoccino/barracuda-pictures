import { extendTheme } from '@chakra-ui/react'

export const chakraTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
})
