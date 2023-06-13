import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { useLogin } from "./hooks/useLogin";
import { useForm } from "react-hook-form";
import { LoginSchemaType, loginSchema } from "./login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { translateError } from "../../utils/translateError";
import { useSignup } from "./hooks/useSignup";
import { useUserContext } from "../../contexts/UserContext";

type Props = {
  isShown: boolean;
};

function LoginOverlay({ isShown }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const { login: contextLogin } = useUserContext();
  const { mutate: login, error: loginError, data: loginData } = useLogin();
  const { mutate: signup, error: signupError, data: signupData } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async ({ email, password }: LoginSchemaType) => {
    if (isLogin) {
      await login({ email, password });
    } else {
      await signup({ email, password });
    }
  };

  useEffect(() => {
    if (loginData || signupData) {
      contextLogin(getValues("email"));
    }
  }, [loginData, signupData, getValues, contextLogin]);

  useEffect(() => {
    if (loginError || signupError) {
      const error = loginError ?? signupError;
      setError("email", {
        type: "manual",
        message: translateError(error)
      });
    }
  }, [loginError, signupError, setError]);

  return (
    <Modal isOpen={isShown} onClose={() => void 0}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalBody gap={2} display="flex" flexDir="column">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" {...register("email")} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              variant="link"
              onClick={() => setIsLogin((v) => !v)}
              colorScheme="primary"
              type="button"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="primary">
              {isLogin ? "Login" : "Register"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default LoginOverlay;
