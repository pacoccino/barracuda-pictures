import { forwardRef, Tooltip, Button, IconButton } from '@chakra-ui/react'

export const TooltipIconButton = forwardRef(
  ({ children, label, tooltipProps, ...props }, ref) => (
    <Tooltip label={label} {...tooltipProps}>
      <IconButton aria-label={label} ref={ref} {...props}>
        {children}
      </IconButton>
    </Tooltip>
  )
)
