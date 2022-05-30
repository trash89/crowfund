import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { BigNumber, utils } from "ethers";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";

import {
  addressNotZero,
  formatBalance,
  getNumConfirmations,
  shortenAddress,
} from "../utils/utils";

import { useIsMounted } from "../hooks";
import { GetStatusIcon, ShowError } from "../components";

const GetCampaign = ({
  idxCampaign,
  activeChain,
  contractAddress,
  contractABI,
  account,
  numConfirmations,
}) => {
  const isMounted = useIsMounted();
  const [value, setValue] = useState("0");
  const [openPledge, setOpenPledge] = useState(false);
  const [openUnpledge, setOpenUnpledge] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(contractAddress)
  );
  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isSuccess: isSuccessCampaign,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "campaigns",
    {
      args: [BigNumber.from(idxCampaign)],
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  const {
    data: pledgedAmount,
    isLoading: isLoadingpledgedAmount,
    isSuccess: isSuccesspledgedAmount,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "pledgedAmount",
    {
      args: [BigNumber.from(idxCampaign), account?.address],
      enabled: isEnabled,
      watch: isEnabled,
    }
  );
  // pledge function
  const {
    data: dataPledge,
    error: errorPledge,
    isError: isErrorPledge,
    isLoading: isLoadingPledge,
    write: writePledge,
    status: statusPledge,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "pledge",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusPledgeWait } = useWaitForTransaction({
    hash: dataPledge?.hash,
    wait: dataPledge?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // unpledge function
  const {
    data: dataUnpledge,
    error: errorUnpledge,
    isError: isErrorUnpledge,
    isLoading: isLoadingUnpledge,
    write: writeUnpledge,
    status: statusUnpledge,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "unpledge",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusUnpledgeWait } = useWaitForTransaction({
    hash: dataUnpledge?.hash,
    wait: dataUnpledge?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // claim function
  const {
    data: dataClaim,
    error: errorClaim,
    isError: isErrorClaim,
    isLoading: isLoadingClaim,
    write: writeClaim,
    status: statusClaim,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "claim",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusClaimWait } = useWaitForTransaction({
    hash: dataClaim?.hash,
    wait: dataClaim?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // refund function
  const {
    data: dataRefund,
    error: errorRefund,
    isError: isErrorRefund,
    isLoading: isLoadingRefund,
    write: writeRefund,
    status: statusRefund,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "refund",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusRefundWait } = useWaitForTransaction({
    hash: dataRefund?.hash,
    wait: dataRefund?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // cancel function
  const {
    data: dataCancel,
    error: errorCancel,
    isError: isErrorCancel,
    isLoading: isLoadingCancel,
    write: writeCancel,
    status: statusCancel,
  } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "cancel",
    {
      enabled: isEnabled,
    }
  );
  const { status: statusCancelWait } = useWaitForTransaction({
    hash: dataCancel?.hash,
    wait: dataCancel?.wait,
    confirmations: numConfirmations,
    enabled: isEnabled,
  });

  // useEffect to setup values
  useEffect(() => {
    if (
      statusPledge !== "loading" &&
      statusPledgeWait !== "loading" &&
      statusUnpledge !== "loading" &&
      statusUnpledgeWait !== "loading" &&
      statusClaim !== "loading" &&
      statusClaimWait !== "loading" &&
      statusRefund !== "loading" &&
      statusRefundWait !== "loading" &&
      statusCancel !== "loading" &&
      statusCancelWait !== "loading"
    ) {
      if (value) setValue("0");
      setDisabled(false);
    }
    // eslint-disable-next-line
  }, [
    statusPledge,
    statusPledgeWait,
    statusUnpledge,
    statusUnpledgeWait,
    statusClaim,
    statusClaimWait,
    statusRefund,
    statusRefundWait,
    statusCancel,
    statusCancelWait,
  ]);

  if (
    !isMounted ||
    isLoadingCampaign ||
    isLoadingpledgedAmount ||
    !isSuccessCampaign ||
    !isSuccesspledgedAmount
  )
    return <></>;

  const handleClosePledge = (event, reason) => {
    if (
      (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) ||
      event.currentTarget.value === "cancel"
    ) {
      if (value) setValue("0");
      setOpenPledge(false);
    } else {
      if (parseInt(event.currentTarget.value) >= 0) {
        setDisabled(true);
        writePledge({
          args: [parseInt(event.currentTarget.value), utils.parseEther(value)],
        });
        setOpenPledge(false);
        if (value) setValue("0");
      }
    }
  };
  const handleCloseUnpledge = (event, reason) => {
    if (
      (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) ||
      event.currentTarget.value === "cancel"
    ) {
      if (value) setValue("0");
      setOpenUnpledge(false);
    } else {
      if (parseInt(event.currentTarget.value) >= 0) {
        setDisabled(true);
        writeUnpledge({
          args: [parseInt(event.currentTarget.value), utils.parseEther(value)],
        });
        setOpenUnpledge(false);
        if (value) setValue("0");
      }
    }
  };

  const handleCloseClaim = (event, reason) => {
    if (
      (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) ||
      event.currentTarget.value === "cancel"
    ) {
      setOpenClaim(false);
    } else {
      if (parseInt(event.currentTarget.value) >= 0) {
        setDisabled(true);
        writeClaim({
          args: [parseInt(event.currentTarget.value)],
        });
        setOpenClaim(false);
      }
    }
  };

  const handleCloseRefund = (event, reason) => {
    if (
      (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) ||
      event.currentTarget.value === "cancel"
    ) {
      setOpenRefund(false);
    } else {
      if (parseInt(event.currentTarget.value) >= 0) {
        setDisabled(true);
        writeRefund({
          args: [parseInt(event.currentTarget.value)],
        });
        setOpenRefund(false);
      }
    }
  };

  const handleCloseCancel = (event, reason) => {
    if (
      (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) ||
      event.currentTarget.value === "cancel"
    ) {
      setOpenCancel(false);
    } else {
      if (parseInt(event.currentTarget.value) >= 0) {
        setDisabled(true);
        writeCancel({
          args: [parseInt(event.currentTarget.value)],
        });
        setOpenCancel(false);
      }
    }
  };
  const idxCampaignFormatted = idxCampaign.toString();
  const creator = campaign[0];
  const creatorFormatted = shortenAddress(creator);
  const goalFormatted = formatBalance(campaign[1], 0);
  const totalPledgedFormatted = formatBalance(campaign[2], 0);
  const startAtFormatted = new Date(
    parseInt(campaign[3]) * 1000
  ).toLocaleString();
  const endAt = new Date(parseInt(campaign[4]) * 1000);
  const endAtFormatted = endAt.toLocaleString();
  const claimedFormatted = campaign[5].toString() === "false" ? "no" : "yes";
  const pledgedAmountFormatted = formatBalance(pledgedAmount, 0);
  const dateNow = new Date().getTime() / 1000;
  return (
    <>
      <TableRow key={idxCampaign} hover={true}>
        <TableCell align="left">{idxCampaignFormatted}</TableCell>
        <TableCell align="left">{creatorFormatted}</TableCell>
        <TableCell align="right">{goalFormatted}</TableCell>
        <TableCell align="right">{totalPledgedFormatted}</TableCell>
        <TableCell align="right">{startAtFormatted}</TableCell>
        <TableCell align="right">{endAtFormatted}</TableCell>
        <TableCell align="right">{claimedFormatted}</TableCell>
        <TableCell align="right">{pledgedAmountFormatted}</TableCell>
        <TableCell align="left">
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0.5}
            padding={0}
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={0.5}
              padding={0}
            >
              {endAt > dateNow && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    value={idxCampaign}
                    disabled={disabled || isLoadingPledge}
                    onClick={() => setOpenPledge(true)}
                    endIcon={<GetStatusIcon status={statusPledge} />}
                  >
                    pledge
                  </Button>
                  <Dialog open={openPledge} onClose={handleClosePledge}>
                    <DialogTitle>Pledge</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Enter the value to pledge for the campaign #
                        {idxCampaign}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        size="small"
                        margin="dense"
                        id="value"
                        label="Value to pledge"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="small"
                        onClick={handleClosePledge}
                        value="cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleClosePledge}
                        value={`${idxCampaign}`}
                      >
                        Pledge
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}

              {/* // if creator===current account, we can claim */}
              {creator === account?.address && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    value={idxCampaign}
                    disabled={disabled || isLoadingClaim}
                    onClick={() => setOpenClaim(true)}
                    endIcon={<GetStatusIcon status={statusClaim} />}
                  >
                    claim
                  </Button>
                  <Dialog open={openClaim} onClose={handleCloseClaim}>
                    <DialogTitle>Claim</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Do you want to claim {formatBalance(pledgedAmount)} for
                        the campaign #{idxCampaign} ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="small"
                        onClick={handleCloseClaim}
                        value="cancel"
                      >
                        cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCloseClaim}
                        value={`${idxCampaign}`}
                      >
                        claim
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
              {/* // if creator===current account, we can cancel */}
              {creator === account?.address && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    value={idxCampaign}
                    disabled={disabled || isLoadingCancel}
                    onClick={() => setOpenCancel(true)}
                    endIcon={<GetStatusIcon status={statusCancel} />}
                  >
                    cancel
                  </Button>
                  <Dialog open={openCancel} onClose={handleCloseCancel}>
                    <DialogTitle>Cancel</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Do you want to cancel the campaign #{idxCampaign} ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="small"
                        onClick={handleCloseCancel}
                        value="cancel"
                      >
                        no
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCloseCancel}
                        value={`${idxCampaign}`}
                      >
                        yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={0.5}
              padding={0}
            >
              {/* // if pledgedAmount is >0, we can unpledge */}
              {pledgedAmount > 0 && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    value={idxCampaign}
                    disabled={disabled || isLoadingUnpledge}
                    onClick={() => setOpenUnpledge(true)}
                    endIcon={<GetStatusIcon status={statusUnpledge} />}
                  >
                    unpledge
                  </Button>
                  <Dialog open={openUnpledge} onClose={handleCloseUnpledge}>
                    <DialogTitle>Unpledge</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Enter the value to unpledge from the campaign #
                        {idxCampaign}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        size="small"
                        margin="dense"
                        id="value"
                        label="Value to unpledge"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="small"
                        onClick={handleCloseUnpledge}
                        value="cancel"
                      >
                        cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCloseUnpledge}
                        value={`${idxCampaign}`}
                      >
                        unpledge
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
              {/* // if pledgedAmount is >0, we can refund */}
              {pledgedAmount > 0 && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    value={idxCampaign}
                    disabled={disabled || isLoadingRefund}
                    onClick={() => setOpenRefund(true)}
                    endIcon={<GetStatusIcon status={statusRefund} />}
                  >
                    refund
                  </Button>
                  <Dialog open={openRefund} onClose={handleCloseRefund}>
                    <DialogTitle>Refund</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Do you want to be refunded with{" "}
                        {formatBalance(pledgedAmount)} from the campaign #
                        {idxCampaign} ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="small"
                        onClick={handleCloseRefund}
                        value="cancel"
                      >
                        cancel
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCloseRefund}
                        value={`${idxCampaign}`}
                      >
                        refund
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Stack>
          </Stack>
        </TableCell>
      </TableRow>
      {(isErrorPledge ||
        isErrorUnpledge ||
        isErrorClaim ||
        isErrorRefund ||
        isErrorCancel) && (
        <>
          {isErrorPledge && (
            <TableRow key={idxCampaign + 10000}>
              <TableCell colSpan={9}>
                <ShowError
                  message="Pledge:"
                  flag={isErrorPledge}
                  error={errorPledge}
                />
              </TableCell>
            </TableRow>
          )}
          {isErrorUnpledge && (
            <TableRow key={idxCampaign + 10001}>
              <TableCell colSpan={9}>
                <ShowError
                  message="Unpledge:"
                  flag={isErrorUnpledge}
                  error={errorUnpledge}
                />
              </TableCell>
            </TableRow>
          )}
          {isErrorClaim && (
            <TableRow key={idxCampaign + 10002}>
              <TableCell colSpan={9}>
                <ShowError
                  message="Claim:"
                  flag={isErrorClaim}
                  error={errorClaim}
                />
              </TableCell>
            </TableRow>
          )}
          {isErrorRefund && (
            <TableRow key={idxCampaign + 10003}>
              <TableCell colSpan={9}>
                <ShowError
                  message="Refund:"
                  flag={isErrorRefund}
                  error={errorRefund}
                />
              </TableCell>
            </TableRow>
          )}
          {isErrorCancel && (
            <TableRow key={idxCampaign + 10004}>
              <TableCell colSpan={9}>
                <ShowError
                  message="Cancel:"
                  flag={isErrorCancel}
                  error={errorCancel}
                />
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
};

const CrowFund = ({
  activeChain,
  contractAddress,
  contractABI,
  tokenAddress,
  tokenABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const numConfirmations = getNumConfirmations(activeChain);
  const isEnabled = Boolean(
    isMounted &&
      activeChain &&
      addressNotZero(contractAddress) &&
      addressNotZero(tokenAddress)
  );

  const {
    data: balanceAccount,
    isSuccess: isSuccessBalanceAccount,
    isError: isErrorBalanceAccount,
    error: errorBalanceAccount,
  } = useBalance({
    addressOrName: account?.address,
    enabled: isEnabled,
    watch: isEnabled,
  });

  const {
    data: balanceToken,
    isSuccess: isSuccessBalanceToken,
    isError: isErrorBalanceToken,
    error: errorBalanceToken,
  } = useBalance({
    addressOrName: account?.address,
    token: tokenAddress,
    enabled: isEnabled,
    watch: isEnabled,
  });

  const {
    data: campaignCount,
    error: errorCampaignCount,
    isError: isErrorCampaignCount,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "count",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  if (!isMounted) return <></>;

  const campaignsArray = [
    ...Array.from({ length: parseInt(campaignCount) }, (_, idx) => `${++idx}`),
  ];

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
          Crowfund ({contractAddress})
        </Typography>
        {account && isSuccessBalanceAccount && isSuccessBalanceToken && (
          <Typography>
            Account {account?.address} ({formatBalance(balanceToken?.value, 0)}{" "}
            {balanceToken?.symbol}) ({formatBalance(balanceAccount?.value)}{" "}
            {balanceAccount?.symbol})
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table padding="checkbox" size="small" aria-label="Campaigns">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Creator</TableCell>
                <TableCell align="center">Goal</TableCell>
                <TableCell align="center">Total Pledged</TableCell>
                <TableCell align="center">Start At</TableCell>
                <TableCell align="center">End At</TableCell>
                <TableCell align="center">Claimed</TableCell>
                <TableCell align="center">Pledged</TableCell>
                <TableCell align="center">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignsArray?.map((campaign) => {
                return (
                  <GetCampaign
                    key={campaign}
                    idxCampaign={campaign}
                    contractAddress={contractAddress}
                    contractABI={contractABI}
                    activeChain={activeChain}
                    account={account}
                    numConfirmations={numConfirmations}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      {isErrorBalanceAccount && isErrorBalanceToken && isErrorCampaignCount && (
        <>
          <ShowError
            message="Balance Account:"
            flag={isErrorBalanceAccount}
            error={errorBalanceAccount}
          />
          <ShowError
            message="Balance Token:"
            flag={isErrorBalanceToken}
            error={errorBalanceToken}
          />
          <ShowError
            message="Campaign Count:"
            flag={isErrorCampaignCount}
            error={errorCampaignCount}
          />
        </>
      )}
    </Paper>
  );
};

export default CrowFund;
