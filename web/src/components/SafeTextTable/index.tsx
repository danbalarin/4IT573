import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  ViewIcon,
  ViewOffIcon
} from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { SafeText } from "../../types/safe-text";
import DeleteModal from "../DeleteModal";
import CreateModal from "../CreateModal";

type Props = {
  texts: SafeText[];
  loading?: boolean;
  onUpdate: (safeText: SafeText) => void;
  onDelete: (id: number) => void;
  onCreate: (safeText: Pick<SafeText, "text" | "domain">) => void;
};

function SafeTextTable({ texts, onCreate, onDelete, onUpdate }: Props) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose
  } = useDisclosure();
  const [deletingText, setDeletingText] = useState<SafeText>();
  const [editingText, setEditingText] = useState<SafeText>();
  const [search, setSearch] = useState<string>("");

  const [shownIds, setShownIds] = useState<number[]>([]);

  const showId = (id: number) => setShownIds((ids) => [...ids, id]);
  const hideId = (id: number) =>
    setShownIds((ids) => ids.filter((shownId) => shownId !== id));
  const isShown = (id: number) => shownIds.includes(id);
  const deleteText = (id: number) => {
    setDeletingText(texts.find((text) => text.id === id) ?? undefined);
    onDeleteOpen();
  };

  const editText = (id: number) => {
    setEditingText(texts.find((text) => text.id === id) ?? undefined);
    onCreateOpen();
  };

  const createText = () => {
    setEditingText(undefined);
    onCreateOpen();
  };

  const onCreateConfirm = (newValues: Pick<SafeText, "domain" | "text">) => {
    onCreateClose();
    if (editingText) {
      onUpdate({ ...editingText, ...newValues });
    } else {
      onCreate(newValues);
    }
  };

  const onDeleteConfirm = () => {
    onDeleteClose();
    if (deletingText) {
      onDelete(deletingText.id);
    }
  };

  const filteredTexts =
    search !== ""
      ? texts.filter((text) =>
          text.domain ? text.domain.includes(search) : true
        )
      : texts;
  console.log(texts);
  return (
    <>
      <CreateModal
        text={editingText}
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onConfirm={onCreateConfirm}
      />
      <DeleteModal
        text={deletingText}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
      />
      <TableContainer minW="40rem">
        <Table size="sm">
          <TableCaption>Passwords and notes</TableCaption>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Password</Th>
              <Th>Domain</Th>
              <Th
                isNumeric
                flexDirection="row"
                alignItems="center"
                display="flex"
              >
                <InputGroup size="xs">
                  <InputLeftAddon children={<SearchIcon />} />
                  <Input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                </InputGroup>
                <IconButton
                  variant="ghost"
                  colorScheme="green"
                  aria-label="Add"
                  size="sm"
                  icon={<AddIcon />}
                  onClick={() => createText()}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTexts
              .sort((a, b) => a.id - b.id)
              .map(({ id, text, domain }) => {
                const isTextShown = isShown(id);
                return (
                  <Tr key={id}>
                    <Td verticalAlign="top">#{id}</Td>
                    <Td whiteSpace="pre">{isTextShown ? text : "****"}</Td>
                    <Td>{domain}</Td>
                    <Td isNumeric verticalAlign="top">
                      <IconButton
                        height="1rem"
                        variant="ghost"
                        size="sm"
                        colorScheme="blue"
                        aria-label={isTextShown ? "Hide" : "Show"}
                        icon={isTextShown ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => (isTextShown ? hideId(id) : showId(id))}
                      />
                      <IconButton
                        height="1rem"
                        colorScheme="orange"
                        aria-label="Edit"
                        icon={<EditIcon />}
                        variant="ghost"
                        size="sm"
                        onClick={() => editText(id)}
                      />
                      <IconButton
                        height="1rem"
                        colorScheme="red"
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteText(id)}
                      />
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default SafeTextTable;
