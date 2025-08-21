import React from "react";
import { Box, Typography, Paper, Divider, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { SubscriptionPlan } from "../../interfaces/subscriptionInterface";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelect?: (plan: SubscriptionPlan) => void;
  highlight?: boolean;
  disabled?: boolean;
}

const currencyFormatter = (amount: number, currency: string = "USD") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

const frequencyLabel = (frequencyInterval?: number) => {
  if (frequencyInterval === 1) return "/year";
  return "/month";
};

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan, onSelect, highlight, disabled }) => {
  const priceText = currencyFormatter(plan?.price || 0, plan?.currency || "USD");
  const periodText = frequencyLabel(plan?.frequencyInterval);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
        border: theme => `1px solid ${theme.palette.divider}`,
        transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
        position: "relative",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      {highlight && (
        <Chip
          label="Recommended"
          color="success"
          size="small"
          sx={{ position: "absolute", top: 12, right: 12, fontWeight: 700 }}
        />
      )}

      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {plan?.name}
        </Typography>

        <Box display="flex" alignItems="baseline" gap={1}>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {priceText}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {periodText.replace("/", "/ ")}
          </Typography>
        </Box>

        {plan?.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {plan?.description}
          </Typography>
        ) : null}

        {(plan?.features && plan?.features?.length > 0) ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.0 }}>
              {plan?.features?.map((feature: any, idx: any) => (
                <Box key={idx} component="li" display="flex" alignItems="center" gap={1}>
                  <CheckRoundedIcon color="success" fontSize="small" />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : null}

        <Button
          fullWidth
          variant={highlight ? "contained" : "outlined"}
          color={highlight ? "primary" : "inherit"}
          sx={{ mt: 2.5, py: 1.25, borderRadius: 2, fontWeight: 700 }}
          disabled={Boolean(disabled)}
          onClick={() => onSelect?.(plan)}
        >
          Select plan
        </Button>
      </Box>
    </Paper>
  );
};

export default SubscriptionPlanCard;
