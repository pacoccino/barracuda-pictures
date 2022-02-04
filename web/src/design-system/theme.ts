import { extendTheme } from '@chakra-ui/react'

const textStyles = {
  h1: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: ['1.3rem', '2rem', '3rem'],
  },
  h2: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: ['1.3rem', '2rem', '2.5rem'],
  },
  h3: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 400,
    fontSize: ['1.1rem', '1.1rem', '1.2rem'],
    textTransform: 'uppercase',
  },
  h4: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: ['1rem', '1rem', '1.5rem'],
  },
  semibold: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  normal: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 300,
    fontSize: '1.1rem',
  },
  small: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 300,
    fontSize: ['0.7rem', '0.9rem'],
  },
  caption: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    textTransform: 'lowercase',
    fontSize: ['1rem', '1.2rem', '1.2rem', '1.2rem'],
    fontVariant: 'small-caps',
  },
  appTitle: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: '0.1rem',
    lineHeight: 1,
    fontSize: ['1.8rem', '2rem', '2.5rem', '2.5rem'],
    color: 'appColor',
  },
  appPunchline: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
}

const Button = {
  baseStyle: {
    borderRadius: '2rem',
    fontWeight: 'normal',
  },
  variants: {
    outline: {
      border: '1px solid',
      borderColor: '#DDE4E9',
      boxShadow: 'xs',
    },
    solid: {
      border: 'none',
      boxShadow: 'base',
    },
    strong: {
      bgGradient: 'linear(to-r, #aeb3ff, #eca2f9)',
    },
    link: {
      color: '#637381',
    },
    tagAction: {
      borderRadius: '0',
      padding: 0,
      color: 'white',
    },
  },
  defaultProps: {
    variant: 'outline',
  },
}

export const chakraTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        background: 'backgroundColor',
        color: 'textColor',
        overflow: 'initial',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1',
      },
    },
  },
  components: {
    Button,
  },
  textStyles,
  colors: {
    appColor: '#39115e',
    textColor: '#212B36',
    backgroundColor: '#f3f1f5',
  },
})
