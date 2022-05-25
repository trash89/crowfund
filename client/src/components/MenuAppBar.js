import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { NavLink } from "react-router-dom";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const MenuAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </NavLink>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crowfund
          </Typography>
          <NavLink
            style={{ flexGrow: 1 }}
            to="/crowfund"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            Crowfund
          </NavLink>
          <NavLink
            style={{ flexGrow: 1 }}
            to="/crowtoken"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            CrowToken
          </NavLink>

          <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuAppBar;
