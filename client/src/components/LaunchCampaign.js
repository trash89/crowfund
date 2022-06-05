import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { GetStatusIcon, ShowError } from "../components";

import { useIsMounted, useGetFuncWrite } from "../hooks";
import { addressNotZero } from "../utils/utils";
import { utils } from "ethers";

const LaunchCampaign = ({
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(contractAddress)
  );
  const [input, setInput] = useState({ goal: "0", startAt: "", endAt: "" });
  const [isErrorInput, setIsErrorInput] = useState({
    goal: false,
    startAt: false,
    endAt: false,
  });

  // launch function
  const {
    error: errorLaunch,
    isError: isErrorLaunch,
    write: writeLaunch,
    status: statusLaunch,
    statusWait: statusLaunchWait,
  } = useGetFuncWrite(
    "launch",
    activeChain,
    contractAddress,
    contractABI,
    isEnabled
  );

  const handleLaunch = (e) => {
    e.preventDefault();
    if (input.goal && parseFloat(input.goal) > 0) {
      if (input.startAt && input.startAt !== "") {
        try {
          const startAtParsed = new Date(input.startAt).getTime() / 1000;
          if (input.endAt && input.endAt !== "") {
            try {
              const endAtParsed = new Date(input.endAt).getTime() / 1000;
              if (startAtParsed < endAtParsed) {
                setDisabled(true);
                writeLaunch({
                  args: [
                    utils.parseEther(input.goal),
                    startAtParsed,
                    endAtParsed,
                  ],
                });
              } else {
                setIsErrorInput({
                  ...isErrorInput,
                  startAt: true,
                  endAt: true,
                });
              }
            } catch (error) {
              setIsErrorInput({ ...isErrorInput, endAt: true });
            }
          } else {
            setIsErrorInput({ ...isErrorInput, endAt: true });
          }
        } catch (error) {
          setIsErrorInput({ ...isErrorInput, startAt: true });
        }
      } else {
        setIsErrorInput({ ...isErrorInput, startAt: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, goal: true });
    }
  };

  const handleGoal = (e) => {
    setInput({ ...input, goal: e.target.value });
    if (isErrorInput.goal) setIsErrorInput({ ...isErrorInput, goal: false });
  };
  const handleStartAt = (e) => {
    setInput({ ...input, startAt: e.target.value });
    if (isErrorInput.startAt)
      setIsErrorInput({ ...isErrorInput, startAt: false });
  };
  const handleEndAt = (e) => {
    setInput({ ...input, endAt: e.target.value });
    if (isErrorInput.endAt) setIsErrorInput({ ...isErrorInput, endAt: false });
  };

  // useEffect to setup values
  useEffect(() => {
    if (statusLaunch !== "loading" && statusLaunchWait !== "loading") {
      if (disabled) setDisabled(false);
      setInput({ goal: "0", startAt: "", endAt: "" });
    }
    // eslint-disable-next-line
  }, [statusLaunch, statusLaunchWait]);

  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Typography variant="h6" gutterBottom component="div">
          Launch Campaign
        </Typography>
        <TextField
          error={isErrorInput.goal}
          autoFocus
          size="small"
          margin="dense"
          id="goal"
          helperText="Campaign Goal"
          type="number"
          value={input.goal}
          onChange={handleGoal}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.startAt}
          size="small"
          margin="dense"
          id="startAt"
          type="datetime-local"
          helperText="Start At"
          value={input.startAt}
          onChange={handleStartAt}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.endAt}
          size="small"
          margin="dense"
          id="endAt"
          type="datetime-local"
          helperText="End At"
          value={input.endAt}
          onChange={handleEndAt}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <Button
          variant="contained"
          size="small"
          disabled={disabled}
          onClick={handleLaunch}
          startIcon={<GetStatusIcon status={statusLaunch} />}
          endIcon={<GetStatusIcon status={statusLaunchWait} />}
        >
          Launch
        </Button>
      </Stack>
      {isErrorLaunch && (
        <ShowError message="Launch:" flag={isErrorLaunch} error={errorLaunch} />
      )}
    </Paper>
  );
};

export default LaunchCampaign;
