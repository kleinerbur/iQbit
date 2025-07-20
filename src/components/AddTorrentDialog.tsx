import { VStack, FormControl, FormLabel, Textarea, Flex, Button, Heading, Input, FormErrorMessage, Switch, Select, LightMode, UseDisclosureReturn, propNames } from "@chakra-ui/react";
import { IoDocumentAttach } from "react-icons/io5";
import IosBottomSheet from "./ios/IosBottomSheet";
import { useMemo, useState } from "react";
import { TorrClient } from "../utils/TorrClient";
import { useMutation, useQuery } from "react-query";

export function AddTorrentDialog(props: {
  disclosure: UseDisclosureReturn
}) {
  const [file, setFile] = useState<File>();
  
  const [fileError, setFileError] = useState("");
  const [textArea, setTextArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [draggingOver, setDraggingOver] = useState(false);
  const [automaticManagement, setAutomaticManagement] = useState(true);
  const [sequentialDownload, setSequentialDownload] = useState(false);
  const [firstAndLastPiece, setFirstAndLastPiece] = useState(false);

  const { data: settings } = useQuery(
    "settings-mainpage",
    TorrClient.getSettings,
    { refetchInterval: 30000 }
  )

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories
  )

  const Categories = useMemo(() => {
    return Object.values(categories || {}).map((c) => ({
      label: c.name,
      value: c.name,
    }));
  }, [categories]);

  const validateAndSelectFile = (file: File) => {
    if (file.name.endsWith(".torrent")) {
      setFile(file);
    } else {
      setFileError("This does not seem to be .torrent file");
    }

    setDraggingOver(false);
  }

  const { mutate: attemptAddTorrent, isLoading: attemptAddLoading } =
    useMutation(
      "addTorrent",
      (opts: { autoTmm?: boolean }) =>
        TorrClient.addTorrent(
          !!textArea ? "urls" : "torrents",
          !!textArea ? textArea : file!
        ),
      { onSuccess: props.disclosure.onClose }
    );

  return (
  <IosBottomSheet title={"Add Torrent"} disclosure={props.disclosure}>
    <VStack gap={4}>
      <FormControl isDisabled={!!file}>
        <FormLabel>{"Magnet Link / URL"}</FormLabel>
        <Textarea
          _disabled={{ bgColor: "gray.50" }}
          value={textArea}
          onChange={(e) => setTextArea(e.target.value)}
        />
      </FormControl>
      <FormControl isDisabled={!!textArea} isInvalid={!!fileError}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <FormLabel mb={0}>{"Add with .torrent file"}</FormLabel>
          {file && (
            <Button
              size={"sm"}
              variant={"ghost"}
              colorScheme={"blue"}
              onClick={(e) => {
                e.preventDefault();
                setFile(undefined);
              }}
            >
              {"Clear"}
            </Button>
          )}
        </Flex>
        <Flex
          gap={4}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
          borderColor={file ? "green.500" : "blue.500"}
          borderWidth={1}
          rounded={"lg"}
          bgColor={
            draggingOver ? "blue.500" : file ? "green.50" : "blue.50"
          }
          p={4}
          color={
            draggingOver ? "white" : file ? "green.500" : "blue.500"
          }
          opacity={!!textArea ? 0.5 : undefined}
        >
          <IoDocumentAttach size={40} />
          <Heading size={"sm"} noOfLines={1}>
            {draggingOver
              ? "Drop it"
              : file
              ? file.name
              : "Click or Drag and Drop"}
          </Heading>
          <Input
            accept={".torrent"}
            onDragEnter={() => {
              if (!!textArea) return;
              setFileError("");
              setDraggingOver(true);
            }}
            onDragLeave={() => setDraggingOver(false)}
            onDrop={(e) =>
              validateAndSelectFile(e.dataTransfer.files[0])
            }
            onChange={(e) =>
              e?.target?.files &&
              validateAndSelectFile(e?.target?.files[0])
            }
            opacity={0}
            _disabled={{ opacity: 0 }}
            type={"file"}
            position={"absolute"}
            top={0}
            width={"100%"}
            height={"100%"}
          />
        </Flex>
        <FormErrorMessage>{fileError}</FormErrorMessage>
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="automaticManagement" mb="0">
          Automatic Management
        </FormLabel>
        <Switch
          id="automaticManagement"
          isChecked={automaticManagement}
          onChange={(e) => {
            setAutomaticManagement(e.target.checked);
          }}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="sequentialDownload" mb="0">
          Sequential Download
        </FormLabel>
        <Switch
          id="sequentialDownload"
          isChecked={sequentialDownload}
          onChange={(e) => {
            setSequentialDownload(e.target.checked);
          }}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="firstAndLastPiece" mb="0">
          Download first and last piece first
        </FormLabel>
        <Switch
          id="firstAndLastPiece"
          isChecked={firstAndLastPiece}
          onChange={(e) => {
            setFirstAndLastPiece(e.target.checked);
          }}
        />
      </FormControl>
      {Categories.length && (
        <FormControl>
          <FormLabel>{"Category"}</FormLabel>
          <Select
            placeholder="Select category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Categories.map((c) => (
              <option key={c.label}>{c.label}</option>
            ))}
          </Select>
        </FormControl>
      )}
    </VStack>
    <LightMode>
      <Button
        disabled={!textArea && !file}
        isLoading={attemptAddLoading}
        width={"100%"}
        size={"lg"}
        colorScheme={"blue"}
        mt={16}
        onClick={() =>
          attemptAddTorrent({ autoTmm: settings?.auto_tmm_enabled })
        }
      >
        {"Add Torrent"}
      </Button>
    </LightMode>
  </IosBottomSheet>
)}