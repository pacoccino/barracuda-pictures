import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'

export const AlertModal = ({
  isOpen,
  loading,
  onCancel,
  onAccept,
  header,
  body,
  acceptLabel,
  acceptColor,
}) => {
  const cancelRef = React.useRef()

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              colorScheme={acceptColor}
              onClick={onAccept}
              ml={3}
              disabled={loading}
            >
              {acceptLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
