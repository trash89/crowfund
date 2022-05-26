import { useContractRead, useToken } from "wagmi";
import { useIsMounted } from ".";
import { addressNotZero } from "../utils/utils";
import { BigNumber, utils } from "ethers";

const useTokenDetails = (
  activeChain,
  contractAddress,
  contractABI,
  account
) => {
  const isMounted = useIsMounted();

  const {
    data: token,
    isError: isErrorToken,
    refetch: refetchToken,
  } = useToken({
    address: contractAddress,
    enabled: Boolean(activeChain && account && addressNotZero(contractAddress)),
    watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
  });

  const { data: owner, isError: isErrorOwner } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "owner",
    {
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
      watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
    }
  );

  const { data: balanceOf, isError: isErrorBalanceOf } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "balanceOf",
    {
      args: [account?.address],
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
      watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
    }
  );

  const { data: allowance, isError: isErrorAllowance } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "allowance",
    {
      args: [owner, account?.address],
      enabled: Boolean(
        activeChain && account && addressNotZero(contractAddress)
      ),
      watch: Boolean(activeChain && account && addressNotZero(contractAddress)),
    }
  );

  if (
    !isMounted ||
    !activeChain ||
    !account ||
    !owner ||
    isErrorToken ||
    isErrorOwner ||
    isErrorBalanceOf ||
    isErrorAllowance
  ) {
    return {
      isSuccess: false,
      isOwner: false,
      ContractOwner: owner,
      token: token,
      refetchToken: refetchToken,
      balanceOf: BigNumber.from("-1"),
      allowance: BigNumber.from("-1"),
    };
  }
  return {
    isSuccess: true,
    isOwner: utils.getAddress(account?.address) === utils.getAddress(owner),
    ContractOwner: owner,
    token: token,
    refetchToken: refetchToken,
    balanceOf: balanceOf,
    allowance: allowance,
  };
};

export default useTokenDetails;
