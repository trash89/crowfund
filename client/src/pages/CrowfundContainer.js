import Stack from "@mui/material/Stack";
import { useIsMounted, useGetContract } from "../hooks";
import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, Crowfund } from "../components";

const CrowfundContainer = () => {
  const isMounted = useIsMounted();
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
    return <SupportedNetworks />;
  }
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount) {
    return <div>Error loading account: {errorAccount?.message}</div>;
  }
  if (!addressNotZero(contractAddress) && !addressNotZero(tokenAddress)) {
    return (
      <div>Contracts not deployed on this network : {activeChain?.name}</div>
    );
  }

  return (
    <>
      {isSuccessAccount && addressNotZero(tokenAddress) && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Crowfund
            activeChain={activeChain}
            contractAddress={contractAddress}
            contractABI={contractABI}
            tokenAddress={tokenAddress}
            tokenABI={tokenABI}
            account={account}
          />
        </Stack>
      )}
    </>
  );
};

export default CrowfundContainer;
