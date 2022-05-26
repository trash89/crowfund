import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
const ShowError = ({ message, flag, error }) => {
  const [localError, setLocalError] = useState(error);
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      setLocalError("");
      setLocalMessage("");
    }, 7000);

    return () => {
      window.clearTimeout(timeoutID);
    };
  }, []);

  return (
    <>
      {flag ? (
        <Typography color="red">
          {localMessage}
          {localError?.reason ? localError?.reason : localError?.message}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};

export default ShowError;
