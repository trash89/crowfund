import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useBalance } from "wagmi";
import { addressNotZero, shortenAddress, formatBalance } from "../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../hooks";
import { Alert } from "../components";
import { showAlert } from "../features/alert/alertSlice";

const CrowFund = ({
  activeChain,
  contractAddress,
  contractABI,
  tokenAddress,
  tokenABI,
  account,
}) => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { isAlert } = useSelector((store) => store.alert);

  const {
    data: balanceToken,
    isSuccess: isSuccessBalanceToken,
    isError: isErrorBalanceToken,
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
  if (!isMounted || isErrorBalanceToken) return <></>;
  return (
    <Paper elevation={4}>
      <Typography variant="h6" gutterBottom component="div">
        Crowfund
      </Typography>
      {isAlert && <Alert />}
      {account && isSuccessBalanceToken && (
        <Typography>
          Connected Account :{shortenAddress(account?.address)} (
          {formatBalance(balanceToken?.value)} {balanceToken?.symbol})
        </Typography>
      )}
    </Paper>
  );
};

export default CrowFund;
