import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { SafeText } from "../../types/safe-text";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  text?: SafeText;
};

function DeleteModal({ isOpen, text, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete record #{text?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Do you really want to delete record #{text?.id}
          {text?.domain && ` associated with domain ${text.domain}`}?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" colorScheme="red" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
