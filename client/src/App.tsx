import AppRoutes from "./shared/routes/Routes";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { themeProvider } from "../src/shared/theme/theme";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <ThemeProvider theme={themeProvider}>
      <CssBaseline />
      <AppRoutes />


      <Toaster />
    </ThemeProvider>
  );
}
