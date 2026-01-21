import type Stripe from "stripe";

// Re-export commonly used Stripe types
export type { Stripe };
export type StripeCustomer = Stripe.Customer;
export type StripePaymentIntent = Stripe.PaymentIntent;
export type StripePaymentMethod = Stripe.PaymentMethod;
export type StripeCharge = Stripe.Charge;
export type StripeRefund = Stripe.Refund;
export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripeInvoice = Stripe.Invoice;
export type StripeSubscription = Stripe.Subscription;
export type StripePrice = Stripe.Price;
export type StripeProduct = Stripe.Product;
export type StripeWebhookEvent = Stripe.Event;

// Payment-related types
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  refunded?: boolean;
}

export interface RefundResponse {
  refundId: string;
  amount: number;
  currency: string;
  status: string;
}

// Webhook types
export interface StripeWebhookPayload {
  type: string;
  data: {
    object: any;
  };
}
