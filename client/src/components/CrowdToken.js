import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { utils, constants } from "ethers";
import { useContractRead } from "wagmi";
import { addressNotZero, shortenAddress, formatBalance } from "../utils/utils";
import { useIsMounted, useTokenDetails, useGetFuncWrite } from "../hooks";
import { GetStatusIcon, ShowError } from ".";

const CrowdToken = ({ activeChain, tokenAddress, tokenABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);

  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(tokenAddress)
  );
  const [input, setInput] = useState({ to: "", from: "", value: "0" });
  const [isErrorInput, setIsErrorInput] = useState({
    to: false,
    from: false,
    value: false,
  });

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
      args: [verifyAddress(input.from), account?.address],
      enabled: Boolean(isEnabled && verifyAddress(input.from)),
      watch: Boolean(isEnabled && verifyAddress(input.from)),
    }
  );

  // mint function
  const {
    error: errorMint,
    isError: isErrorMint,
    write: writeMint,
    status: statusMint,
    statusWait: statusMintWait,
  } = useGetFuncWrite("mint", activeChain, tokenAddress, tokenABI, isEnabled);

  // burnFrom function
  const {
    error: errorBurnFrom,
    isError: isErrorBurnFrom,
    write: writeBurnFrom,
    status: statusBurnFrom,
    statusWait: statusBurnFromWait,
  } = useGetFuncWrite(
    "burnFrom",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // burn function

  const {
    error: errorBurn,
    isError: isErrorBurn,
    write: writeBurn,
    status: statusBurn,
    statusWait: statusBurnWait,
  } = useGetFuncWrite("burn", activeChain, tokenAddress, tokenABI, isEnabled);

  // increaseAllowance(spender, value)
  const {
    error: errorIncreaseAllowance,
    isError: isErrorIncreaseAllowance,
    write: writeIncreaseAllowance,
    status: statusIncreaseAllowance,
    statusWait: statusIncreaseAllowanceWait,
  } = useGetFuncWrite(
    "increaseAllowance",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // decreaseAllowance(spender, value);
  const {
    error: errorDecreaseAllowance,
    isError: isErrorDecreaseAllowance,
    write: writeDecreaseAllowance,
    status: statusDecreaseAllowance,
    statusWait: statusDecreaseAllowanceWait,
  } = useGetFuncWrite(
    "decreaseAllowance",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // transfer(to, amount);
  const {
    error: errorTransfer,
    isError: isErrorTransfer,
    write: writeTransfer,
    status: statusTransfer,
    statusWait: statusTransferWait,
  } = useGetFuncWrite(
    "transfer",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // approve(spender, amount);
  const {
    error: errorApprove,
    isError: isErrorApprove,
    write: writeApprove,
    status: statusApprove,
    statusWait: statusApproveWait,
  } = useGetFuncWrite(
    "approve",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // transferOwnership(address newOwner)
  const {
    error: errorTransferOwnership,
    isError: isErrorTransferOwnership,
    write: writeTransferOwnership,
    status: statusTransferOwnership,
    statusWait: statusTransferOwnershipWait,
  } = useGetFuncWrite(
    "transferOwnership",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

  // transferFrom(address from, address to, uint256 amount)
  const {
    error: errorTransferFrom,
    isError: isErrorTransferFrom,
    write: writeTransferFrom,
    status: statusTransferFrom,
    statusWait: statusTransferFromWait,
  } = useGetFuncWrite(
    "transferFrom",
    activeChain,
    tokenAddress,
    tokenABI,
    isEnabled
  );

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
      if (disabled) setDisabled(false);
      setInput({ to: "", from: "", value: "0" });
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

  // handleMint
  const handleMint = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) > 0) {
      if (input.to && utils.isAddress(input.to)) {
        setDisabled(true);
        writeMint({
          args: [utils.getAddress(input.to), utils.parseEther(input.value)],
        });
      } else {
        setDisabled(true);
        writeMint({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(input.value),
          ],
        });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleBurn and burnFrom
  const handleBurn = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) > 0) {
      if (input.to && utils.isAddress(input.to)) {
        setDisabled(true);
        writeBurnFrom({
          args: [utils.getAddress(input.to), utils.parseEther(input.value)],
        });
      } else {
        setDisabled(true);
        writeBurn({
          args: [utils.parseEther(input.value)],
        });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleIncreaseAllowance
  const handleIncreaseAllowance = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) > 0) {
      if (input.to && utils.isAddress(input.to)) {
        setDisabled(true);
        writeIncreaseAllowance({
          args: [utils.getAddress(input.to), utils.parseEther(input.value)],
        });
      } else {
        setDisabled(true);
        writeIncreaseAllowance({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(input.value),
          ],
        });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleDecreaseAllowance
  const handleDecreaseAllowance = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) > 0) {
      if (input.to && utils.isAddress(input.to)) {
        setDisabled(true);
        writeDecreaseAllowance({
          args: [utils.getAddress(input.to), utils.parseEther(input.value)],
        });
      } else {
        setDisabled(true);
        writeDecreaseAllowance({
          args: [
            utils.getAddress(account?.address),
            utils.parseEther(input.value),
          ],
        });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleApprove
  const handleApprove = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) > 0) {
      if (input.to && utils.isAddress(input.to)) {
        const formattedAddress = utils.getAddress(input.to);
        setDisabled(true);
        writeApprove({
          args: [formattedAddress, utils.parseEther("0")],
        });
        writeApprove({
          args: [formattedAddress, utils.parseEther(input.value)],
        });
      } else {
        setIsErrorInput({ ...isErrorInput, to: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleTransfer
  const handleTransfer = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) >= 0) {
      if (input.to && utils.isAddress(input.to)) {
        setDisabled(true);
        writeTransfer({
          args: [utils.getAddress(input.to), utils.parseEther(input.value)],
        });
      } else {
        setIsErrorInput({ ...isErrorInput, to: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };

  // handleTransferOwnership
  const handleTransferOwnership = (e) => {
    e.preventDefault();
    if (input.to && utils.isAddress(input.to)) {
      setDisabled(true);
      writeTransferOwnership({
        args: [utils.getAddress(input.to)],
      });
    } else {
      setIsErrorInput({ ...isErrorInput, to: true });
    }
  };

  // handleTransferFrom
  const handleTransferFrom = (e) => {
    e.preventDefault();
    if (input.value && utils.parseEther(input.value) >= 0) {
      if (
        input.to &&
        utils.isAddress(input.to) &&
        input.from &&
        utils.isAddress(input.from)
      ) {
        setDisabled(true);
        writeTransferFrom({
          args: [
            utils.getAddress(input.from),
            utils.getAddress(input.to),
            utils.parseEther(input.value),
          ],
        });
      } else {
        setIsErrorInput({ ...isErrorInput, to: true, from: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, value: true });
    }
  };
  const handleInputTo = (e) => {
    setInput({ ...input, to: e.target.value });
    if (isErrorInput.to) setIsErrorInput({ ...isErrorInput, to: false });
  };
  const handleInputFrom = (e) => {
    setInput({ ...input, from: e.target.value });
    if (isErrorInput.from) setIsErrorInput({ ...isErrorInput, from: false });
  };
  const handleInputValue = (e) => {
    setInput({ ...input, value: e.target.value });
    if (isErrorInput.value) setIsErrorInput({ ...isErrorInput, value: false });
  };

  if (!isMounted) return <></>;

  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
        padding={1}
      >
        <Typography variant="h6" gutterBottom component="div">
          CrowdToken
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
        spacing={0}
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
          Allowance from {shortenAddress(verifyAddress(input.from))}:{" "}
          {formatBalance(allowanceOther, 0)} {token?.symbol}
        </Typography>
        <TextField
          error={isErrorInput.to}
          autoFocus
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="dense"
          label="Address To? (empty if owner)"
          size="small"
          value={input.to}
          onChange={handleInputTo}
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.from}
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="dense"
          label="Address From? (empty if owner)"
          size="small"
          value={input.from}
          onChange={handleInputFrom}
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.value}
          helperText="How many tokens?"
          variant="standard"
          type="number"
          required
          margin="dense"
          label="Amount"
          size="small"
          value={input.value}
          onChange={handleInputValue}
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
            disabled={disabled}
            startIcon={<GetStatusIcon status={statusMint} />}
            endIcon={<GetStatusIcon status={statusMintWait} />}
          >
            Mint
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={handleBurn}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusBurn} />}
          endIcon={<GetStatusIcon status={statusBurnWait} />}
        >
          Burn
        </Button>
        {isOwner && (
          <Button
            variant="contained"
            size="small"
            onClick={handleTransferOwnership}
            disabled={disabled}
            startIcon={<GetStatusIcon status={statusTransferOwnership} />}
            endIcon={<GetStatusIcon status={statusTransferOwnershipWait} />}
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
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusIncreaseAllowance} />}
          endIcon={<GetStatusIcon status={statusIncreaseAllowanceWait} />}
        >
          Increase Allowance
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleDecreaseAllowance}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusDecreaseAllowance} />}
          endIcon={<GetStatusIcon status={statusDecreaseAllowanceWait} />}
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
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusApprove} />}
          endIcon={<GetStatusIcon status={statusApproveWait} />}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleTransfer}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusTransfer} />}
          endIcon={<GetStatusIcon status={statusTransferWait} />}
        >
          Transfer
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleTransferFrom}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusTransferFrom} />}
          endIcon={<GetStatusIcon status={statusTransferFromWait} />}
        >
          Transfer From
        </Button>
      </Stack>
      {isErrorMint && (
        <ShowError message="Mint:" flag={isErrorMint} error={errorMint} />
      )}
      {isErrorBurn && (
        <ShowError message="Burn:" flag={isErrorBurn} error={errorBurn} />
      )}
      {isErrorBurnFrom && (
        <ShowError
          message="BurnFrom:"
          flag={isErrorBurnFrom}
          error={errorBurnFrom}
        />
      )}
      {isErrorIncreaseAllowance && (
        <ShowError
          message="Increase Allowance:"
          flag={isErrorIncreaseAllowance}
          error={errorIncreaseAllowance}
        />
      )}
      {isErrorDecreaseAllowance && (
        <ShowError
          message="Decrease Allowance:"
          flag={isErrorDecreaseAllowance}
          error={errorDecreaseAllowance}
        />
      )}
      {isErrorAllowanceOther && (
        <ShowError
          message="Allowance Other:"
          flag={isErrorAllowanceOther}
          error={errorAllowanceOther}
        />
      )}
      {isErrorTransfer && (
        <ShowError
          message="Transfer:"
          flag={isErrorTransfer}
          error={errorTransfer}
        />
      )}
      {isErrorTransferFrom && (
        <ShowError
          message="Transfer From:"
          flag={isErrorTransferFrom}
          error={errorTransferFrom}
        />
      )}
      {isErrorApprove && (
        <ShowError
          message="Approve:"
          flag={isErrorApprove}
          error={errorApprove}
        />
      )}
      {isErrorTransferOwnership && (
        <ShowError
          message="Transfer Ownership:"
          flag={isErrorTransferOwnership}
          error={errorTransferOwnership}
        />
      )}
    </Paper>
  );
};

export default CrowdToken;
