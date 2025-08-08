import { Box, Typography, Container, Button } from "@mui/material";
import pageNotFound from "../../assets/svg/page-not-found.svg";

export default function PageNotFound() {
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
          alt="Access Denied"
          style={{ width: "100%", maxWidth: 240, margin: "0 auto" }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mt: 2,
            mb: 0,
          }}
        >
          Access Denied!
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 14 }}>
          You have no permission to visit this page
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
        >
          Back to previous page
        </Button>
      </Container>
    </Box>
  );
}
