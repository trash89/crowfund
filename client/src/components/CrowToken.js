import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { utils, constants } from "ethers";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import {
  addressNotZero,
  shortenAddress,
  formatBalance,
  getNumConfirmations,
} from "../utils/utils";
import { useIsMounted, useTokenDetails } from "../hooks";
import { GetStatusIcon, ShowError } from "../components";

const CrowToken = ({ activeChain, tokenAddress, tokenABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [transferFrom, setTransferFrom] = useState("");
  const [inputValue, setInputValue] = useState("0");
  const numConfirmations = getNumConfirmations(activeChain);
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(tokenAddress)
  );

  // token details for display
  const {
    isOwner,
    ContractOwner: tokenOwner,
    token,
    refetchToken,
    balanceOf,
    allowance,
  } = useTokenDetails(activeChain, tokenAddress, tokenABI, account);

  const verifyAddress = (address) => {
    if (address) {
      if (utils.isAddress(address)) return utils.getAddress(address);
      else return constants.AddressZero;
    } else return account?.address;
  };
  const {
    data: allowanceOther,
    error: errorAllowanceOther,
    isError: isErrorAllowanceOther,
  } = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "allowance",
    {
      args: [verifyAddress(transferFrom), account?.address],
      enabled: Boolean(isEnabled && verifyAddress(transferFrom)),
      watch: Boolean(isEnabled && verifyAddress(transferFrom)),
    }
  );

  // mint function
  const {
    data: dataMint,
    error: errorMint,
    isError: isErrorMint,
    isLoading: isLoadingMint,
    write: writeMint,
    status: statusMint,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "mint",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusMintWait } = useWaitForTransaction({
    hash: dataMint?.hash,
    wait: dataMint?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });
  // burnFrom function
  const {
    data: dataBurnFrom,
    error: errorBurnFrom,
    isError: isErrorBurnFrom,
    isLoading: isLoadingBurnFrom,
    write: writeBurnFrom,
    status: statusBurnFrom,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "burnFrom",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusBurnFromWait } = useWaitForTransaction({
    hash: dataBurnFrom?.hash,
    wait: dataBurnFrom?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // burn function

  const {
    data: dataBurn,
    error: errorBurn,
    isError: isErrorBurn,
    isLoading: isLoadingBurn,
    write: writeBurn,
    status: statusBurn,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "burn",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusBurnWait } = useWaitForTransaction({
    hash: dataBurn?.hash,
    wait: dataBurn?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // increaseAllowance(spender, value)
  const {
    data: dataIncreaseAllowance,
    error: errorIncreaseAllowance,
    isError: isErrorIncreaseAllowance,
    isLoading: isLoadingIncreaseAllowance,
    write: writeIncreaseAllowance,
    status: statusIncreaseAllowance,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "increaseAllowance",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusIncreaseAllowanceWait } = useWaitForTransaction({
    hash: dataIncreaseAllowance?.hash,
    wait: dataIncreaseAllowance?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // decreaseAllowance(spender, value);
  const {
    data: dataDecreaseAllowance,
    error: errorDecreaseAllowance,
    isError: isErrorDecreaseAllowance,
    isLoading: isLoadingDecreaseAllowance,
    write: writeDecreaseAllowance,
    status: statusDecreaseAllowance,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "decreaseAllowance",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusDecreaseAllowanceWait } = useWaitForTransaction({
    hash: dataDecreaseAllowance?.hash,
    wait: dataDecreaseAllowance?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // transfer(to, amount);

  const {
    data: dataTransfer,
    error: errorTransfer,
    isError: isErrorTransfer,
    isLoading: isLoadingTransfer,
    write: writeTransfer,
    status: statusTransfer,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "transfer",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusTransferWait } = useWaitForTransaction({
    hash: dataTransfer?.hash,
    wait: dataTransfer?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // approve(spender, amount);
  const {
    data: dataApprove,
    error: errorApprove,
    isError: isErrorApprove,
    isLoading: isLoadingApprove,
    write: writeApprove,
    status: statusApprove,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "approve",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusApproveWait } = useWaitForTransaction({
    hash: dataApprove?.hash,
    wait: dataApprove?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // transferOwnership(address newOwner)
  const {
    data: dataTransferOwnership,
    error: errorTransferOwnership,
    isError: isErrorTransferOwnership,
    isLoading: isLoadingTransferOwnership,
    write: writeTransferOwnership,
    status: statusTransferOwnership,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "transferOwnership",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusTransferOwnershipWait } = useWaitForTransaction({
    hash: dataTransferOwnership?.hash,
    wait: dataTransferOwnership?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // transferFrom(address from, address to, uint256 amount)
  const {
    data: dataTransferFrom,
    error: errorTransferFrom,
    isError: isErrorTransferFrom,
    isLoading: isLoadingTransferFrom,
    write: writeTransferFrom,
    status: statusTransferFrom,
  } = useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: tokenABI,
    },
    "transferFrom",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusTransferFromWait } = useWaitForTransaction({
    hash: dataTransferFrom?.hash,
    wait: dataTransferFrom?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // useEffect to setup values
  useEffect(() => {
    if (
      statusMint !== "loading" &&
      statusBurn !== "loading" &&
      statusBurnFrom !== "loading" &&
      statusIncreaseAllowance !== "loading" &&
      statusDecreaseAllowance !== "loading" &&
      statusTransfer !== "loading" &&
      statusApprove !== "loading" &&
      statusTransferOwnership !== "loading" &&
      statusTransferFrom !== "loading" &&
      statusMintWait !== "loading" &&
      statusBurnWait !== "loading" &&
      statusBurnFromWait !== "loading" &&
      statusIncreaseAllowanceWait !== "loading" &&
      statusDecreaseAllowanceWait !== "loading" &&
      statusTransferWait !== "loading" &&
      statusApproveWait !== "loading" &&
      statusTransferOwnershipWait !== "loading" &&
      statusTransferFromWait !== "loading"
    ) {
      setDisabled(false);
      setInputValue("0");
      setInputAddress("");
      setTransferFrom("");
      refetchToken();
    }
    // eslint-disable-next-line
  }, [
    statusMint,
    statusBurn,
    statusBurnFrom,
    statusIncreaseAllowance,
    statusDecreaseAllowance,
    statusTransfer,
    statusApprove,
    statusTransferOwnership,
    statusTransferFrom,
    statusMintWait,
    statusBurnWait,
    statusBurnFromWait,
    statusIncreaseAllowanceWait,
    statusDecreaseAllowanceWait,
    statusTransferWait,
    statusApproveWait,
    statusTransferOwnershipWait,
    statusTransferFromWait,
  ]);

  if (!isMounted) return <></>;

  // handleMint
  const handleMint = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) > 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeMint({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      } else {
        setDisabled(true);
        writeMint({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(inputValue),
          ],
        });
      }
    }
  };

  // handleBurn and burnFrom
  const handleBurn = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) > 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeBurnFrom({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      } else {
        setDisabled(true);
        writeBurn({
          args: [utils.parseEther(inputValue)],
        });
      }
    }
  };

  // handleIncreaseAllowance
  const handleIncreaseAllowance = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) > 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeIncreaseAllowance({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      } else {
        setDisabled(true);
        writeIncreaseAllowance({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(inputValue),
          ],
        });
      }
    }
  };

  // handleDecreaseAllowance
  const handleDecreaseAllowance = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) > 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeDecreaseAllowance({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      } else {
        setDisabled(true);
        writeDecreaseAllowance({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(inputValue),
          ],
        });
      }
    }
  };

  // handleApprove
  const handleApprove = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) > 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeApprove({
          args: [utils.getAddress(inputAddress), utils.parseEther("0")],
        });

        writeApprove({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      }
    }
  };

  // handleTransfer
  const handleTransfer = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) >= 0) {
      if (inputAddress && utils.isAddress(inputAddress)) {
        setDisabled(true);
        writeTransfer({
          args: [utils.getAddress(inputAddress), utils.parseEther(inputValue)],
        });
      }
    }
  };

  // handleTransferOwnership
  const handleTransferOwnership = (e) => {
    e.preventDefault();
    if (inputAddress && utils.isAddress(inputAddress)) {
      setDisabled(true);
      writeTransferOwnership({
        args: [utils.getAddress(inputAddress)],
      });
    }
  };

  // handleTransferFrom
  const handleTransferFrom = (e) => {
    e.preventDefault();
    if (inputValue && utils.parseEther(inputValue) >= 0) {
      if (
        inputAddress &&
        utils.isAddress(inputAddress) &&
        transferFrom &&
        utils.isAddress(transferFrom)
      ) {
        setDisabled(true);
        writeTransferFrom({
          args: [
            utils.getAddress(transferFrom),
            utils.getAddress(inputAddress),
            utils.parseEther(inputValue),
          ],
        });
      }
    }
  };

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
          CrowToken
        </Typography>
        <Typography>
          Owner:{" "}
          {shortenAddress(tokenOwner ? tokenOwner : constants.AddressZero)},
          TotalSupply: {formatBalance(token?.totalSupply?.value, 0)}{" "}
          {token?.symbol}
        </Typography>
      </Stack>

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Typography color={isOwner ? "blue" : "text.primary"}>
          Connected: {account?.address} {isOwner && <>(token owner)</>}
        </Typography>
        <Typography>
          Balance: {formatBalance(balanceOf, 0)} {token?.symbol}
        </Typography>
        <Typography>
          Allowance to spend from owner: {formatBalance(allowance, 0)}{" "}
          {token?.symbol}
        </Typography>
        <Typography>
          Allowance from {shortenAddress(verifyAddress(transferFrom))}:{" "}
          {formatBalance(allowanceOther, 0)} {token?.symbol}
        </Typography>
        <TextField
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="normal"
          label="Address To? (empty if owner)"
          size="small"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          disabled={disabled}
        />
        <TextField
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="normal"
          label="Address From? (empty if owner)"
          size="small"
          value={transferFrom}
          onChange={(e) => setTransferFrom(e.target.value)}
          disabled={disabled}
        />
        <TextField
          helperText="How many tokens?"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          variant="standard"
          type="number"
          required
          margin="normal"
          label="Amount"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        {isOwner && (
          <Button
            variant="contained"
            size="small"
            onClick={handleMint}
            disabled={disabled || isLoadingMint}
            endIcon={<GetStatusIcon status={statusMint} />}
          >
            Mint
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={handleBurn}
          disabled={disabled || isLoadingBurn || isLoadingBurnFrom}
          endIcon={<GetStatusIcon status={statusBurn} />}
        >
          Burn
        </Button>
        {isOwner && (
          <Button
            variant="contained"
            size="small"
            onClick={handleTransferOwnership}
            disabled={disabled || isLoadingTransferOwnership}
            endIcon={<GetStatusIcon status={statusTransferOwnership} />}
          >
            Transfer Ownership
          </Button>
        )}
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleIncreaseAllowance}
          disabled={disabled || isLoadingIncreaseAllowance}
          endIcon={<GetStatusIcon status={statusIncreaseAllowance} />}
        >
          Increase Allowance
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleDecreaseAllowance}
          disabled={disabled || isLoadingDecreaseAllowance}
          endIcon={<GetStatusIcon status={statusDecreaseAllowance} />}
        >
          Decrease Allowance
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleApprove}
          disabled={disabled || isLoadingApprove}
          endIcon={<GetStatusIcon status={statusApprove} />}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleTransfer}
          disabled={disabled || isLoadingTransfer}
          endIcon={<GetStatusIcon status={statusTransfer} />}
        >
          Transfer
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleTransferFrom}
          disabled={disabled || isLoadingTransferFrom}
          endIcon={<GetStatusIcon status={statusTransferFrom} />}
        >
          Transfer From
        </Button>
      </Stack>
      {(isErrorMint ||
        isErrorBurn ||
        isErrorBurnFrom ||
        isErrorIncreaseAllowance ||
        isErrorDecreaseAllowance ||
        isErrorTransfer ||
        isErrorApprove ||
        isErrorTransferOwnership ||
        isErrorAllowanceOther ||
        isErrorTransferFrom) && (
        <>
          <ShowError
            message="Allowance Other:"
            flag={isErrorAllowanceOther}
            error={errorAllowanceOther}
          />
          <ShowError message="Mint:" flag={isErrorMint} error={errorMint} />
          <ShowError message="Burn:" flag={isErrorBurn} error={errorBurn} />
          <ShowError
            message="BurnFrom:"
            flag={isErrorBurnFrom}
            error={errorBurnFrom}
          />
          <ShowError
            message="Increase Allowance:"
            flag={isErrorIncreaseAllowance}
            error={errorIncreaseAllowance}
          />
          <ShowError
            message="Decrease Allowance:"
            flag={isErrorDecreaseAllowance}
            error={errorDecreaseAllowance}
          />
          <ShowError
            message="Transfer:"
            flag={isErrorTransfer}
            error={errorTransfer}
          />
          <ShowError
            message="Approve:"
            flag={isErrorApprove}
            error={errorApprove}
          />
          <ShowError
            message="Transfer Ownership:"
            flag={isErrorTransferOwnership}
            error={errorTransferOwnership}
          />
          <ShowError
            message="Transfer From:"
            flag={isErrorTransferFrom}
            error={errorTransferFrom}
          />
        </>
      )}
    </Paper>
  );
};

export default CrowToken;
