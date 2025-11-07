export type userProps = {
  id: string;
  name: string;
  goal: number;
  has_onbarded: boolean;
  is_subscribed: boolean;
  subscription_status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  trial_end: Date;
};
