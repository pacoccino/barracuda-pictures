import { motion } from 'framer-motion'
import { useState } from 'react'
import { Box } from '@chakra-ui/react'

export function HorizontalCollapse({ isOpen, children, width, ...props }) {
  const [hidden, setHidden] = useState(!isOpen)

  return (
    <motion.div
      hidden={hidden}
      initial={false}
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => setHidden(!isOpen)}
      animate={{
        width: isOpen ? width : 0,
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Box {...props}>{children}</Box>
    </motion.div>
  )
}
