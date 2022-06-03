import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { GetStatusIcon, ShowError } from "../components";

import { useIsMounted } from "../hooks";
import { addressNotZero, getNumConfirmations } from "../utils/utils";
import { utils } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";

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
  const numConfirmations = getNumConfirmations(activeChain);
  const [goal, setGoal] = useState("0");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isErrorHandle, setIsErrorHandle] = useState(false);
  const [errorHandle, setErrorHandle] = useState({ reason: "" });

  // launch function
  const {
    data: dataLaunch,
    error: errorLaunch,
    isError: isErrorLaunch,
    isLoading: isLoadingLaunch,
    write: writeLaunch,
    status: statusLaunch,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "launch",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusLaunchWait } = useWaitForTransaction({
    hash: dataLaunch?.hash,
    wait: dataLaunch?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  const handleLaunch = (e) => {
    e.preventDefault();
    if (goal && utils.parseEther(goal) > 0 && startAt && endAt) {
      const startAtParsed = new Date(startAt).getTime() / 1000;
      const endAtParsed = new Date(endAt).getTime() / 1000;
      if (startAtParsed < endAtParsed) {
        setDisabled(true);
        writeLaunch({
          args: [utils.parseEther(goal), startAtParsed, endAtParsed],
        });
      }
    } else {
      setIsErrorHandle(true);
      setErrorHandle({ reason: "Please enter all correct values" });
    }
  };
  // useEffect to setup values
  useEffect(() => {
    if (statusLaunch !== "loading" && statusLaunchWait !== "loading") {
      setDisabled(false);
      setGoal("0");
      setStartAt("");
      setEndAt("");
      setIsErrorHandle(false);
      setErrorHandle({ reason: "" });
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
          autoFocus
          size="small"
          margin="dense"
          id="goal"
          helperText="Campaign Goal"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <TextField
          size="small"
          margin="dense"
          id="startAt"
          type="datetime-local"
          helperText="Start At"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <TextField
          size="small"
          margin="dense"
          id="endAt"
          type="datetime-local"
          helperText="End At"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          fullWidth
          variant="standard"
          disabled={disabled}
        />
        <Button
          variant="contained"
          size="small"
          disabled={disabled || isLoadingLaunch}
          onClick={handleLaunch}
          endIcon={<GetStatusIcon status={statusLaunch} />}
        >
          Launch
        </Button>
      </Stack>
      {isErrorLaunch ||
        (isErrorHandle && (
          <>
            <ShowError
              message="Launch:"
              flag={isErrorLaunch}
              error={errorLaunch}
            />
            <ShowError
              message="Handle:"
              flag={isErrorHandle}
              error={errorHandle}
            />
          </>
        ))}
    </Paper>
  );
};

export default LaunchCampaign;
