import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  activeChain: "",
  contractAddress: "",
  contractABI: "",
  tokenAddress: "",
  tokenABI: "",
};

const infoSlice = createSlice({
  name: "Info",
  initialState,
  reducers: {
    connect: (state, action) => {
      state.isConnected = true;
      state.activeChain = action.payload.activeChain;
      state.contractAddress = action.payload.contractAddress;
      state.contractABI = action.payload.contractABI;
      state.tokenAddress = action.payload.tokenAddress;
      state.tokenABI = action.payload.tokenABI;
    },
    disconnect: (state, action) => {
      state.isConnected = false;
      state.activeChain = "";
      state.contractAddress = "";
      state.contractABI = "";
      state.tokenAddress = "";
      state.tokenABI = "";
    },
  },
});

export const { connect, disconnect } = infoSlice.actions;
export default infoSlice.reducer;
