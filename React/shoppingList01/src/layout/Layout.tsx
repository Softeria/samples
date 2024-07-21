import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import ShoppingAppBar from "../components/ShoppingAppBar";

const Layout = () => {
  return (
    <Container maxWidth={false} sx={{ padding: "0 !important" }}>
      <ShoppingAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          mt: 0,
          scrollbarWidth: "thin",
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
};

export default Layout;
