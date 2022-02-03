import { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import { QUERY } from 'src/components/Tag/EditTagsModal/EditTagsModalCell'

export const BodyModal = ({ body, title, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
      </ModalContent>
    </Modal>
  )
}
