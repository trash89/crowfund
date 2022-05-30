import Stack from "@mui/material/Stack";
import { useIsMounted, useGetContract } from "../hooks";
import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, CrowToken } from "../components";

const CrowTokenContainer = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const { address: tokenAddress, ABI: tokenABI } = useGetContract("CrowToken");
  const {
    data: account,
    error: errorAccount,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
    isSuccess: isSuccessAccount,
  } = useAccount({
    enabled: Boolean(isMounted && activeChain && addressNotZero(tokenAddress)),
  });

  if (!isMounted) return <></>;
  if (!activeChain) {
    return <SupportedNetworks />;
  }
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount) {
    return <div>Error loading account: {errorAccount?.message}</div>;
  }
  if (!addressNotZero(tokenAddress)) {
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );
  }

  return (
    <>
      {isSuccessAccount && addressNotZero(tokenAddress) && (
        <Stack
          direction="row"
          spacing={2}
          padding={1}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <CrowToken
            activeChain={activeChain}
            tokenAddress={tokenAddress}
            tokenABI={tokenABI}
            account={account}
          />
        </Stack>
      )}
    </>
  );
};

export default CrowTokenContainer;
