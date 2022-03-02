import { extendTheme } from '@chakra-ui/react'

const textStyles = {
  h1: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: '1.2rem',
  },
  h2: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 500,
    fontSize: '1.1rem',
  },
  h3: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 300,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  h4: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: '0.8rem',
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
        fontSize: '14px',
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
    tagColor: '#9cbec4',
    orchid: {
      100: '#BC88E7',
      200: '#B378E3',
      300: '#A967E0',
      400: '#A056DC',
      500: '#9645D9', //
      600: '#8D34D5',
      700: '#822ACB',
      800: '#7826BA',
      900: '#6D23A9',
    },
    celadon: {
      100: '#D6FFFA',
      200: '#70FFEE',
      300: '#00B8A2',
      400: '#00A390',
      500: '#008778', //
      600: '#007A6C',
      700: '#00665A',
      800: '#005248',
      900: '#003D36',
    },
    fulvous: {
      100: '#FFE8C2',
      200: '#FFD899',
      300: '#FFC05C',
      400: '#FFA91F',
      500: '#E08A00',
      600: '#B87100',
      700: '#8F5800',
      800: '#663F00',
      900: '#3D2600',
    },
  },
})
