import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const ErrorPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth={false} id="layout-container-protected">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 6rem)",
          mt: "7rem",
          alignItems: "center",
        }}
      >
        Page not found
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20rem", marginTop: "3rem", fill: theme.palette.mode === "dark" ? "#cfcfcf" : "#008fb1" }} />
        <Box sx={{ pt: "3rem", cursor: "pointer" }} onClick={() => navigate("/")}>
          Click here to return to home page.
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorPage;
