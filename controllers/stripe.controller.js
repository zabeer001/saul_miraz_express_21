import Stripe from 'stripe';
import Order from '../models/order.model.js';
import { BACKEND_URL, FRONTEND_URL, STRIPE_SECRET } from '../config/env.js';

const stripe = new Stripe(STRIPE_SECRET);

// Stripe Checkout
export const stripeCheckout = async (req, res) => {
  const { order_id } = req.body;
  const user = req.authUser;
  const frontendUrl = FRONTEND_URL;
  const backendUrl = `${BACKEND_URL}/api/stripe`;

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
      success_url: `${backendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
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

// Stripe Checkout Success
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
      } else {
        return res.redirect(`${frontendUrl}/payment/canceled`);
      }
    } else {
      return res.redirect(`${frontendUrl}/payment/canceled`);
    }
  } catch (error) {
    console.error('Stripe success redirect error:', error);
    return res.redirect(`${frontendUrl}/payment/canceled`);
  }
};

// Stripe Checkout Cancel
export const stripeCheckoutCancel = (req, res) => {
  const frontendUrl = FRONTEND_URL;
  return res.redirect(`${frontendUrl}/payment/canceled`);
};

// Stripe Check Payment Status
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
