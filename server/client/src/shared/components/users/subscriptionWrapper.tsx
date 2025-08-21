// SubscriptionsWrapper.tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Subscriptions from './Subscriptions';

const stripePromise = loadStripe('pk_test_...');

export default function SubscriptionsWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Subscriptions />
    </Elements>
  );
}
