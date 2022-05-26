import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";
import App from "./App";
import { themeOptions } from "./MUITheme";
//import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  apiProvider,
  configureChains,
  //getDefaultWallets,
  connectorsForWallets,
  wallet,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createClient, chain, WagmiConfig } from "wagmi";

// if (!process.env.REACT_APP_RINKEBY_URL || !process.env.REACT_APP_ARBRINKEBY_URL)
//   throw new Error(
//     "Missing environment variables. Make sure to set your .env file."
//   );

const { provider, chains } = configureChains(
  [chain.hardhat, chain.rinkeby],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

//const { connectors } = getDefaultWallets({
//  appName: "Crowfund Ethereum App, with Wagmi,Rainbowkit and Material-UI",
//  chains,
//});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [wallet.injected({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: process.env.REACT_APP_GRAPH_URL,
// });

const theme = createTheme(themeOptions);

ReactDOM.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* <ApolloProvider client={apolloClient}> */}
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
        {/* </ApolloProvider> */}
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
