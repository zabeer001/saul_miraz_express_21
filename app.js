
import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';
import connectTODatacase from './database/mongodb.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
// import User from './models/user.model.js';
import productRouter from './routes/product.routes.js';
import promoCodeRouter from './routes/promoCode.routes.js';
import reviewRouter from './routes/review.routes.js';
import orderRouter from './routes/order.routes.js';
import contactRouter from './routes/contact.router.js';
import cors from 'cors';
import stripeRouter from './routes/stripe.routes.js';
import subscribeRouter from './routes/subscribe.routers.js';
import generalRouter from './routes/general.router.js';
import customerRouter from './routes/customer.routers.js';
import bodyParser from 'body-parser';




const app = express();

// Stripe webhook needs raw body
// app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// app.post('/api/stripe/webhook', (req, res) => {
//   // Handle Stripe webhook event here
//   // Example: verify signature and process event
//   res.status(200).send('Webhook received');
// });

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Allow all origins (Access-Control-Allow-Origin: *) 
app.use(cors());

app.get('/', (req, res) => {
  res.send(`app is running on http://localhost:${PORT}`);
});

// app.use('/api/auth', authRouter);
app.use('/api', generalRouter);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);

// products
// app.use('/api', productRouter);
app.use('/api/products', productRouter);

app.use('/api/promocodes', promoCodeRouter);
app.use('/api/reviews', reviewRouter);

// order
// app.use('/api', orderRouter);
app.use('/api/orders', orderRouter);


app.use('/api/customers', customerRouter);
app.use('/api/contacts', contactRouter);

app.use('/api/stripe', stripeRouter);

app.use('/api/subscribe', subscribeRouter);







app.listen(PORT, async () => {
    console.log(`http://localhost:${PORT}`);
    await connectTODatacase();
});

export default app;