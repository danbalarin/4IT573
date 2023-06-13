import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea
} from "@chakra-ui/react";
import { SafeText } from "../../types/safe-text";
import { useForm } from "react-hook-form";
import { SafeTextSchemaType } from "./schema";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onConfirm: (newText: Pick<SafeText, "text" | "domain">) => void;
  onClose: () => void;
  text?: SafeText;
};

function CreateModal({ isOpen, text, onClose, onConfirm }: Props) {
  const [isLongText, setIsLongText] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SafeTextSchemaType>({
    values: text
      ? { text: text.text, domain: text.domain }
      : { text: "", domain: "" }
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onConfirm)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{text ? `Edit #${text.id}` : "Create new"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody gap={2} display="flex" flexDir="column">
            <FormControl isInvalid={!!errors.text}>
              <FormLabel>{isLongText ? "Note" : "Password"}</FormLabel>
              {isLongText ? (
                <Textarea {...register("text")} />
              ) : (
                <Input type="text" {...register("text")} />
              )}
              <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.domain}>
              <FormLabel>Domain</FormLabel>
              <Input type="domain" {...register("domain")} />
              <FormErrorMessage>{errors.domain?.message}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              variant="link"
              onClick={() => setIsLongText((v) => !v)}
              colorScheme="primary"
              type="button"
            >
              {isLongText ? "I want to save password" : "I want to save note"}
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="blue"
              type="button"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button colorScheme="green" type="submit">
              {text ? "Save" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default CreateModal;
