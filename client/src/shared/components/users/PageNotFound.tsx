import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import pageNotFound from "../../../assets/svg/page-not-found.svg";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          m: 10,
        }}
      >
        <img
          src={pageNotFound}
          alt="Page Not Found"
          style={{ width: "100%", maxWidth: 240, margin: "0 auto" }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mt: 2,
          }}
        >
          404 Page Not Found !
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
          The page you are looking for does not exist.
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            height: 56,
            width: "auto",
            mt: 3,
            textTransform: "none",
          }}
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
        >
          Go to Previous Page
        </Button>
      </Container>
    </Box>
  );
}
