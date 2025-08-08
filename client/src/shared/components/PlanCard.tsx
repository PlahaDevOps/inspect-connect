import React, { useState } from "react";
import { Box,   Switch, Typography, Paper, Divider } from "@mui/material";

const SubscriptionPlanCard: React.FC = () => {
  const [features, setFeatures] = useState({
    billing: true,
    trial: false,
    autoRenew: true,
    cancelAnytime: false,
  });

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        width: "100%", 
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#27272a",
          textAlign: "center",
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 1 }}>
          InspectConnect Monthly Access
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 600, color: "#fff" }}>
          $49.99
        </Typography>
        <Typography variant="body2" sx={{ color: "#fff" }}>
          / month
        </Typography>
      </Box>

      {/* Features */}
      <Box sx={{ p: 2 }}>
        
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={2}
        >
          <Box>
            <Typography fontWeight={600}>Auto-renew</Typography>
            <Typography variant="body2" color="text.secondary">
              Plan will automatically renew 
            </Typography>
          </Box>
          <Switch
            checked={features.autoRenew}
            onChange={() => toggleFeature("autoRenew")}
            color="default"
            sx={{
            
              
              "& .MuiSwitch-thumb": {
                backgroundColor: "#27272a",
              },
            }}
          />
        </Box>
        <Divider />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography fontWeight={600}>Billing Frequency</Typography>
            <Typography variant="body2" color="text.secondary">
              Recurring, every 30 days
            </Typography>
          </Box>
       
        </Box>
        <Divider />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={2}
        >
          <Box>
            <Typography fontWeight={600}>Trial Period</Typography>
            <Typography variant="body2" color="text.secondary">
              7-day free trial (optional)
            </Typography>
          </Box>
        
        </Box>
        <Divider />


        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box>
            <Typography fontWeight={600}>Cancellation</Typography>
            <Typography variant="body2" color="text.secondary">
              Cancel anytime from dashboard
            </Typography>
          </Box>
        
        </Box>
      </Box>

      {/* CTA */}
      {/* <Box p={2}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#27272a",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            py: 1.5,
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#27272a",
            },
          }}
        >
          Buy Package
        </Button>
      </Box> */}
    </Paper>
  );
};

export default SubscriptionPlanCard;
