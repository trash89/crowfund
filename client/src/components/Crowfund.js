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

import { BigNumber, utils, constants } from "ethers";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";

import {
  addressNotZero,
  shortenAddress,
  formatBalance,
  getNumConfirmations,
} from "../utils/utils";

import { useIsMounted } from "../hooks";
import { GetStatusIcon, ShowError } from "../components";

const GetCampaign = ({
  idxCampaign,
  activeChain,
  contractAddress,
  contractABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);
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
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );

  const {
    data: pledgedAmount,
    isLoading: isLoadingpledgedAmount,
    isSuccess: isSuccesspledgedAmount,
    status: statusPledged,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "pledgedAmount",
    {
      args: [BigNumber.from(idxCampaign), account?.address],
      enabled: Boolean(activeChain && addressNotZero(contractAddress)),
      watch: Boolean(activeChain && addressNotZero(contractAddress)),
    }
  );
  if (
    !isMounted ||
    isLoadingCampaign ||
    isLoadingpledgedAmount ||
    !isSuccessCampaign ||
    !isSuccesspledgedAmount
  )
    return <></>;
  const startAtFormatted = new Date(
    parseInt(campaign[3]) * 1000
  ).toLocaleString();
  const endAtFormatted = new Date(
    parseInt(campaign[4]) * 1000
  ).toLocaleString();
  return (
    <TableRow key={idxCampaign}>
      <TableCell align="left">{idxCampaign.toString()}</TableCell>
      <TableCell align="left">{shortenAddress(campaign[0])}</TableCell>
      <TableCell align="right">{campaign[1].toString()}</TableCell>
      <TableCell align="right">{campaign[2].toString()}</TableCell>
      <TableCell align="right">{startAtFormatted}</TableCell>
      <TableCell align="right">{endAtFormatted}</TableCell>
      <TableCell align="right">{campaign[5].toString()}</TableCell>
      <TableCell align="right">{pledgedAmount.toString()}</TableCell>
      <TableCell align="right">
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
            <Button
              variant="contained"
              size="small"
              value={idxCampaign}
              disabled={disabled}
              endIcon={<GetStatusIcon status={statusPledged} />} //to be reviewed
            >
              pledge
            </Button>
            <Button
              variant="contained"
              size="small"
              value={idxCampaign}
              disabled={disabled}
              endIcon={<GetStatusIcon status={statusPledged} />} //to be reviewed
            >
              claim
            </Button>
            {campaign[0] === account?.address && (
              <Button
                variant="contained"
                size="small"
                value={idxCampaign}
                disabled={disabled}
                endIcon={<GetStatusIcon status={statusPledged} />} //to be reviewed
              >
                cancel
              </Button>
            )}
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0.5}
            padding={0}
          >
            <Button
              variant="contained"
              size="small"
              value={idxCampaign}
              disabled={disabled}
              endIcon={<GetStatusIcon status={statusPledged} />} //to be reviewed
            >
              unpledge
            </Button>

            <Button
              variant="contained"
              size="small"
              value={idxCampaign}
              disabled={disabled}
              endIcon={<GetStatusIcon status={statusPledged} />} //to be reviewed
            >
              refund
            </Button>
          </Stack>
        </Stack>
      </TableCell>
    </TableRow>
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
  const [disabled, setDisabled] = useState(false);

  const {
    data: balanceToken,
    isSuccess: isSuccessBalanceToken,
    isError: isErrorBalanceToken,
    error: errorBalanceToken,
  } = useBalance({
    addressOrName: account?.address,
    token: tokenAddress,
    enabled: Boolean(
      activeChain &&
        addressNotZero(contractAddress) &&
        addressNotZero(tokenAddress)
    ),
    watch: Boolean(
      activeChain &&
        addressNotZero(contractAddress) &&
        addressNotZero(tokenAddress)
    ),
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
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
      watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
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
          Crowfund
        </Typography>
        {account && isSuccessBalanceToken && (
          <Typography>
            Connected Account :{shortenAddress(account?.address)} (
            {formatBalance(balanceToken?.value)} {balanceToken?.symbol})
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Campaigns">
            <TableHead>
              <TableRow>
                <TableCell align="left">#</TableCell>
                <TableCell align="left">Creator</TableCell>
                <TableCell align="left">Goal</TableCell>
                <TableCell align="left">Total Pledged</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">End At</TableCell>
                <TableCell align="left">Claimed</TableCell>
                <TableCell align="left">Pledged</TableCell>
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
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      {isErrorBalanceToken && isErrorCampaignCount && (
        <>
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
