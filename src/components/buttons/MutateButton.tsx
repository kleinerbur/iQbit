import { Button, ButtonProps } from "@chakra-ui/react";
import { MutationFunction, useMutation } from "react-query";
import { TorrClient } from "../../utils/TorrClient";
import { IoPause, IoPlay } from "react-icons/io5";
import { AxiosResponse } from "axios";

interface MutateButtonProps extends ButtonProps {
  mutationKey: string
  mutationFn: MutationFunction<AxiosResponse<any, any>, void>
}

function MutateButton(props: MutateButtonProps) {
  const mutation = useMutation(props.mutationKey, props.mutationFn)
  return (
    <Button
      variant={props.variant ?? "outline"}
      onClick={async () => {
        await mutation.mutateAsync()
      }}
      isLoading={mutation.isLoading}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export function PauseAllButton(props: ButtonProps) {
  return (
    <MutateButton
      mutationKey={"pauseAll"}
      mutationFn={TorrClient.pauseAll}
      leftIcon={<IoPause/>}
      {...props}
    >
      {props.children ?? "Pause All"}
    </MutateButton>
  )
}

export function ResumeAllButton(props: ButtonProps) {
  return (
    <MutateButton
      mutationKey={"resumeAll"}
      mutationFn={TorrClient.resumeAll}
      leftIcon={<IoPlay/>}
      {...props}
    >
      {props.children ?? "Resume All"}
    </MutateButton>
  )
}