import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./features/alert/alertSlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer,
  },
});
