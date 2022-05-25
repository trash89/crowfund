import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAlert: false,
  alertType: "",
  alertText: "",
};

const alertSlice = createSlice({
  name: "Alert",
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.isAlert = true;
      state.alertType = action.payload.alertType;
      state.alertText = action.payload.alertText;
    },
    closeAlert: (state, action) => {
      state.isAlert = false;
      state.alertType = "";
      state.alertText = "";
    },
  },
});

export const { showAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
