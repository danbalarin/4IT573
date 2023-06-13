import { Center, Heading } from "@chakra-ui/react";
import LoginOverlay from "../../components/LoginOverlay";
import SafeTextTable from "../../components/SafeTextTable";
import { useUserContext } from "../../contexts/UserContext";
import { useGetSafeTexts } from "./hooks/useGetSafeTexts";
import { useCreateSafeText } from "./hooks/useCreateSafeText";
import { useEffect } from "react";
import { useDeleteSafeText } from "./hooks/useDeleteSafeText";
import { useUpdateSafeText } from "./hooks/useUpdateSafeText";

function HomePage() {
  const { email } = useUserContext();
  const { data, query } = useGetSafeTexts();
  const { mutate: create, data: createData } = useCreateSafeText();
  const { mutate: deleteText, data: deleteData } = useDeleteSafeText();
  const { mutate: update, data: updateData } = useUpdateSafeText();

  useEffect(() => {
    if (email) {
      query();
    }
  }, [email, query, deleteData, createData, updateData]);

  return (
    <Center as="main" flexDirection="column" py={4} gap={4}>
      <LoginOverlay isShown={!email} />
      <Heading>{email ? `Hello ${email}` : "Please login first"}</Heading>
      {email && (
        <SafeTextTable
          texts={data ?? []}
          onCreate={create}
          onDelete={(id) => deleteText({ id })}
          onUpdate={update}
        />
      )}
    </Center>
  );
}

export default HomePage;
