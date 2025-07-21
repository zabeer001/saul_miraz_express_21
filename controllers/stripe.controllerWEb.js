import Stripe from 'stripe';
import Order from '../models/order.model.js';
import { FRONTEND_URL, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET } from '../config/env.js';

const stripe = new Stripe(STRIPE_SECRET);

// Checkout
export const stripeCheckout = async (req, res) => {
  const { order_id } = req.body;
  const user = req.authUser;
  const frontendUrl = FRONTEND_URL;

  if (!order_id) {
    return res.status(400).json({ error: 'order_id is required' });
  }

  if (!user || !user.email) {
    return res.status(401).json({ error: 'Unauthorized or missing user email' });
  }

  try {
    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: { name: 'Product' },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/canceled`,
      customer_email: user.email,
      metadata: { order_id: order._id.toString() },
    });

    order.sessionId = session.id;
    await order.save();

    return res.status(200).json({
      status: 'success',
      checkout_url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Checkout Success
export const stripeCheckoutSuccess = async (req, res) => {
  const sessionId = req.query.session_id;
  const frontendUrl = FRONTEND_URL;

  if (!sessionId) {
    return res.redirect(`${frontendUrl}/payment/canceled`);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const orderId = session.metadata.order_id;
      const order = await Order.findById(orderId);

      if (order) {
        order.payment_status = 'paid';
        await order.save();
        return res.redirect(`${frontendUrl}/payment/success`);
      }
    }

    return res.redirect(`${frontendUrl}/payment/canceled`);
  } catch (error) {
    console.error('Stripe success redirect error:', error);
    return res.redirect(`${frontendUrl}/payment/canceled`);
  }
};

// Checkout Cancel
export const stripeCheckoutCancel = (req, res) => {
  const frontendUrl = FRONTEND_URL;
  return res.redirect(`${frontendUrl}/payment/canceled`);
};

// Check Payment Status
export const stripeCheckPaymentStatus = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.json({
      payment_status: session.payment_status,
      order_status: session.payment_status === 'paid' ? 'completed' : 'pending',
    });
  } catch (error) {
    console.error('Stripe payment status error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Webhook Handler
export const stripeHandleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Webhook Error: Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
          const orderId = session.metadata.order_id;
          const order = await Order.findById(orderId);

          if (order) {
            order.payment_status = 'paid';
            order.sessionId = session.id;
            await order.save();
          }
        }
        break;
      }
      case 'checkout.session.expired': {
        const expiredSession = event.data.object;
        const expiredOrderId = expiredSession.metadata.order_id;
        const expiredOrder = await Order.findById(expiredOrderId);

        if (expiredOrder) {
          expiredOrder.payment_status = 'canceled';
          await expiredOrder.save();
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
