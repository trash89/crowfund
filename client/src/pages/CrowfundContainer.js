import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useIsMounted, useGetContract } from "../hooks";
import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";
import { connect, disconnect } from "../features/connectInfo/infoSlice";

import { SupportedNetworks, Crowfund } from "../components";

const CrowfundContainer = () => {
  const isMounted = useIsMounted();
  const [dispatched, setDispatched] = useState(false);
  const dispatch = useDispatch();
  const { activeChain } = useNetwork();
  const { address: contractAddress, ABI: contractABI } =
    useGetContract("Crowfund");
  const { address: tokenAddress, ABI: tokenABI } = useGetContract("CrowToken");

  const {
    data: account,
    error: errorAccount,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
    isSuccess: isSuccessAccount,
  } = useAccount({
    enabled: Boolean(activeChain && addressNotZero(contractAddress)),
  });

  if (!isMounted) return <></>;
  if (!activeChain) {
    dispatch(disconnect());
    return <SupportedNetworks />;
  }
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount) {
    dispatch(disconnect());
    return <div>Error loading account: {errorAccount?.message}</div>;
  }
  if (!addressNotZero(contractAddress) && !addressNotZero(tokenAddress)) {
    dispatch(disconnect());
    return (
      <div>Contracts not deployed on this network : {activeChain?.name}</div>
    );
  }

  if (!dispatched) {
    dispatch(
      connect({
        activeChain,
        contractAddress,
        contractABI,
        tokenAddress,
        tokenABI,
      })
    );
    setDispatched(true);
  }

  return (
    <>
      {dispatched && (
        <Container component={Paper} maxWidth="sm" disableGutters={true}>
          {isSuccessAccount && <Crowfund account={account} />}
        </Container>
      )}
    </>
  );
};

export default CrowfundContainer;
