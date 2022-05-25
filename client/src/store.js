import { configureStore } from "@reduxjs/toolkit";
import infoReducer from "./features/connectInfo/infoSlice";
import alertReducer from "./features/alert/alertSlice";

export const store = configureStore({
  reducer: {
    info: infoReducer,
    alert: alertReducer,
  },
});
