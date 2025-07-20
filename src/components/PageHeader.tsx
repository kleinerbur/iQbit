import React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  LightMode,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useIsLargeScreen } from "../utils/screenSize";
import { IoChevronBack } from "react-icons/io5";
import { ColorModeButton } from "./buttons/ColorModeButton";

export interface PageHeaderProps {
  title: string;
  onAddButtonClick?: () => void;
  isHomeHeader?: boolean;
  buttonLabel?: string;
  onBackButtonPress?: () => void;
}

const PageHeader = (props: PageHeaderProps) => {
  const BgColor = useColorModeValue("whiteAlpha.300", "blackAlpha.500");
  const isLarge = useIsLargeScreen();

  const shouldBeBigHeader = props?.isHomeHeader && isLarge;
  const headerInBox = !props?.isHomeHeader && isLarge;

  return (
    <Flex
      position={shouldBeBigHeader ? "fixed" : undefined}
      top={0}
      left={0}
      pt={!isLarge ? 5 : headerInBox ? 0 : 5}
      pb={shouldBeBigHeader ? 5 : 2}
      px={shouldBeBigHeader ? 5 : 0}
      width={"100%"}
      justifyContent={"space-between"}
      zIndex={"docked"}
      backdropFilter={shouldBeBigHeader ? "blur(15px)" : undefined}
      alignItems={"center"}
      bgColor={shouldBeBigHeader ? BgColor : undefined}
    >
      <Flex gap={2} alignItems={"center"}>
        {props.onBackButtonPress && (
          <Button
            variant={"ghost"}
            onClick={() => props.onBackButtonPress && props.onBackButtonPress()}
            width={12}
            h={12}
            p={1}
          >
            <IoChevronBack size={25} />
          </Button>
        )}
        <Heading size={!headerInBox ? "3xl" : "xl"} m={0}>
          {props.title}
        </Heading>
      </Flex>
      {props.isHomeHeader &&
        <ButtonGroup spacing={5}>
          <ColorModeButton/>
          {props?.onAddButtonClick && (
            <LightMode>
              <Tooltip
                hasArrow
                placement={'bottom'}
                label={'Add Torrent'}
                fontSize={'md'}
                openDelay={500}
              >
                <Button
                  position={"relative"}
                  rounded={"100%"}
                  width={12}
                  height={12}
                  colorScheme={"blue"}
                  onClick={props.onAddButtonClick}
                  role={"group"}
                >
                  <FaPlus size={40} />
                </Button>
              </Tooltip>
            </LightMode>
          )}
        </ButtonGroup>
      }
    </Flex>
  );
};

export default PageHeader;
