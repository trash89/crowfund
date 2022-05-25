import MUIAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { closeAlert } from "../features/alert/alertSlice";

const Alert = () => {
  const dispatch = useDispatch();
  const { alertType, alertText } = useSelector((store) => store.alert);
  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      dispatch(closeAlert());
    }, 5000);

    return () => {
      window.clearTimeout(timeoutID);
    };
  }, []);
  return (
    <MUIAlert variant="outlined" severity={`${alertType}`}>
      {alertText}
    </MUIAlert>
  );
};

export default Alert;
