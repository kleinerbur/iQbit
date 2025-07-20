import { Button, ButtonProps, LightMode, Tooltip, useColorMode } from "@chakra-ui/react";
import { IoMoon, IoSunny } from "react-icons/io5";

export function ColorModeButton(props: ButtonProps) {
  const colorMode = useColorMode()
  return (
    <LightMode>
      <Tooltip
        hasArrow
        placement={'bottom'}
        label={`Toggle ${colorMode.colorMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        fontSize={'md'}
        openDelay={500}
      >
        <Button
          colorScheme={'blue'}
          rounded={'100%'}
          width={12}
          height={12}
          onClick={colorMode.toggleColorMode}
        >
            {colorMode.colorMode === "dark"
              ? <IoSunny size={40}/>
              : <IoMoon size={40}/>
            }
        </Button>
      </Tooltip>
    </LightMode>
  )
}