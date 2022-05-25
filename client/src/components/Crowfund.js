import { Typography } from "@mui/material";
import { useBalance } from "wagmi";
import { addressNotZero, shortenAddress } from "../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../hooks";
import { Alert } from "../components";
import { showAlert } from "../features/alert/alertSlice";

const CrowFund = ({ account }) => {
  const isMounted = useIsMounted();
  const { isAlert } = useSelector((store) => store.alert);
  const dispatch = useDispatch();
  const { activeChain, contractAddress, tokenAddress } = useSelector(
    (store) => store.info
  );
  const {
    data: balanceToken,
    error: errorBalanceToken,
    isLoading: isLoadingBalanceToken,
    isSuccess: isSuccessBalanceToken,
    isError: isErrorBalanceToken,
  } = useBalance({
    addressOrName: account?.address,
    token: tokenAddress,
    enabled: Boolean(activeChain && addressNotZero(contractAddress)),
    watch: Boolean(activeChain && addressNotZero(contractAddress)),
  });
  if (!isMounted || isLoadingBalanceToken) return <></>;
  if (isErrorBalanceToken) {
    dispatch(
      showAlert({ alertType: "error", alertText: errorBalanceToken.message })
    );
  }
  return (
    <>
      <Typography variant="h6" gutterBottom component="div">
        Crowfund
      </Typography>
      {isAlert && <Alert />}
      {account && isSuccessBalanceToken && (
        <Typography>
          Account :{shortenAddress(account?.address)} ({balanceToken.formatted}{" "}
          {balanceToken.symbol})
        </Typography>
      )}
    </>
  );
};

export default CrowFund;
