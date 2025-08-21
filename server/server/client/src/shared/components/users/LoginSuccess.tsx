// src/pages/auth/LoginSuccess.tsx
import { useEffect } from "react";
import { Box, Button, Container, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

type LoginSuccessProps = { 
  name?: string; 
  primaryRoute?: string; 
  autoRedirect?: boolean; 
  redirectDelayMs?: number;
};

export default function LoginSuccess({
  name,
  primaryRoute = "/dashboard",
  autoRedirect = true,
  redirectDelayMs = 0,
}: LoginSuccessProps) {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const displayName =
    name ||
    location?.state?.name ||
    location?.state?.email ||
    location?.state?.phoneNumber ||
    "";

  useEffect(() => {
    if (!autoRedirect) return;
    const t = setTimeout(() => navigate(primaryRoute), redirectDelayMs);
    return () => clearTimeout(t);
  }, [autoRedirect, redirectDelayMs, navigate, primaryRoute]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(80% 60% at 50% 0%, rgba(76, 175, 80, 0.12) 0%, rgba(76, 175, 80, 0.04) 40%, transparent 70%)",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            backdropFilter: "blur(6px)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "success.light",
              color: "success.contrastText",
            }}
            aria-hidden
          >
            <CheckCircle2 size={44} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            aria-live="polite"
            aria-atomic="true"
          >
            You’re in! 🎉
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {displayName ? `Welcome back, ${displayName}. ` : ""}
            Login was successful. {autoRedirect ? "Taking you to your dashboard..." : "Choose where to go next."}
          </Typography>

          {autoRedirect && (
            <LinearProgress
              sx={{
                width: "100%",
                mb: 3,
                borderRadius: 999,
                height: 6,
              }}
              aria-label="Redirecting progress"
            />
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1.5}
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(primaryRoute)}
              endIcon={<ArrowRight size={18} />}
              sx={{ textTransform: "none", px: 3, height: 48 }}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
              startIcon={<Home size={18} />}
              sx={{ textTransform: "none", px: 3, height: 48 }}
            >
              Back to Home
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Tip: You can change the redirect route by passing <code>primaryRoute</code> prop.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
