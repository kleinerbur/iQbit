import { useMutation, useQuery, useQueryClient } from "react-query"
import { TorrClient } from "../../utils/TorrClient"
import { Button, ButtonProps, Tooltip } from "@chakra-ui/react"
import { IoSpeedometer } from "react-icons/io5"
import { useState } from "react"

export interface SpeedLimitsModeButtonProps extends ButtonProps {
  colorSchemeEnabled?: string
  colorSchemeDisabled?: string
}

export function SpeedLimitsModeButton(props: SpeedLimitsModeButtonProps) {
  const client = useQueryClient()
  const [isSpeedLimited, setSpeedLimited] = useState<Boolean>(false)

  useQuery({
    queryKey: "speedLimitsMode",
    queryFn: TorrClient.getSpeedLimitsMode,
    onSuccess: (data) => setSpeedLimited(data)
  })

  const toggle = useMutation({
    mutationKey: "toggleSpeedLimit",
    mutationFn: async () => {
      await TorrClient.toggleAlternativeSpeedLimit()
      await client.invalidateQueries("speedLimitsMode")
      await client.invalidateQueries("getTransferInfo")
    }
  })

  return (
    <Tooltip
      hasArrow
      placement={'bottom'}
      label={'Toggle Global Speed Limit'}
      fontSize={'md'}
      openDelay={500}
    >
      <Button
        size={"lg"}
        onClick={async () => {
          await toggle.mutateAsync()
        }}
        variant={props.variant ?? "outline"}
        colorScheme={isSpeedLimited ? (props.colorSchemeEnabled ?? "orange") : (props.colorSchemeDisabled ?? "gray")}
        isLoading={toggle.isLoading}
        {...props}
      >
        <IoSpeedometer/>
      </Button>
    </Tooltip>
  )
}