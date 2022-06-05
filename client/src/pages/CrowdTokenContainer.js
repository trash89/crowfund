import Stack from "@mui/material/Stack";
import { useIsMounted, useGetContract } from "../hooks";
import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, CrowdToken } from "../components";

const MyTokenContainer = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const { address: tokenAddress, ABI: tokenABI } = useGetContract("CrowdToken");
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
          direction="column"
          spacing={1}
          padding={1}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <CrowdToken
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

export default MyTokenContainer;
