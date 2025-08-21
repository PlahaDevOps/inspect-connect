import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { getSubscriptionPlans, createSubscription, createCheckoutSession } from '../../../store/actions/authActions';
import type { SubscriptionPlan as SubscriptionPlanType } from '../../interfaces/subscriptionInterface';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Subscriptions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stripeCustomerId } = useLocation().state || {};
  const { subscriptionPlans, loading } = useSelector((state: RootState) => state.auth);

  const [highlightPlanId, setHighlightPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!subscriptionPlans?.length && !loading) {
      dispatch(getSubscriptionPlans());
    }
  }, [dispatch, loading, subscriptionPlans]);

  const handleSubscribe = async (planId: string, isManual: number) => {
    setHighlightPlanId(planId);
    try {
      const action = await dispatch(createSubscription({ customerId: stripeCustomerId, planId: planId, isManual: isManual }));
      const data: any = (action as any).payload;
      
      if(data){
        const checkoutAction = await dispatch(createCheckoutSession({ 
          customerId: stripeCustomerId, 
          priceId: data.items.data ? data.items.data[0].price.id : "",
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-failed`
        }));
        const checkoutData: any = (checkoutAction as any).payload;
        if(checkoutData?.url){
          window.location.href = checkoutData.url;
        }
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned from server.');
      }
    } catch (err) {
      console.error('Subscription creation failed:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate('/inspector/dashboard', { replace: true })}>Skip Payment</Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Choose a Plan
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {subscriptionPlans && subscriptionPlans
          .filter((plan) => plan._id) // Only show plans with valid IDs
          .map((plan: SubscriptionPlanType) => (
          <Box
            key={plan._id!}
            sx={{
              border: highlightPlanId === plan._id ? '2px solid blue' : '1px solid #ccc',
              borderRadius: 2,
              p: 3,
              width: 250,
              cursor: 'pointer',
            }}
            onClick={() => handleSubscribe(plan._id!, 1, plan._id!)}
          >
            <Typography variant="h6">{plan.name}</Typography>
            <Typography variant="body2">{plan.description}</Typography>
            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
              ${plan.price} / {plan.frequencyInterval === 1 ? 'year' : 'month'}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => handleSubscribe(plan._id!, 1, plan._id!)}
            >
              Subscribe
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
