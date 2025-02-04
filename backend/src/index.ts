import { Local } from './environment/env';
import express from 'express';
import sequelize from './config/db';
import cors from 'cors';
import userRouter from './routers/userRouter';
import Stripe from 'stripe';
import Request from './models/Request';
import Transaction from './models/Transaction';

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use('/', userRouter);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // Update the apiVersion to the expected value
    apiVersion: '2025-01-27.acacia',
});
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;

        // Create a PaymentIntent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});
//////////
// server.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// PayPal environment setup
const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
    'AeC0Eq4zGlez1yWtFJ_ZJZy5-_dKijce1xsrzx0EqsCjKqaWpk2A6I-zOV-OlUePxTHH351I0dykKerx',
    'EJvBAshI3bw0SGX9uzw37qrxaEVr0YSo-paLlMtNKW1YXpuCpVb-rOGo-j9MevHz4tFyHU2AsyULek6B'
);
const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

app.post('/api/paypal-transaction-complete', async (req, res) => {
    const { orderID } = req.body;

    // Construct a request object and set desired parameters
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    try {
        const order = await paypalClient.execute(request);

        // Save transaction details to the database
        const newTransaction = await Transaction.create({
            orderID: order.result.id,
            payerID: order.result.payer.payer_id,
            amount: order.result.purchase_units[0].amount.value,
            status: order.result.status,
        });

        res.status(200).json({ message: 'Transaction verified and saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify and save transaction' });
    }
});
/////////
sequelize.sync({ alter: false }).then(() => {
    console.log('Database connected');

    app.listen(Local.SERVER_PORT, () => {
        console.log(`Server is running on port ${Local.SERVER_PORT}`);
    });
}).catch((err) => {
    console.log("Error: ", err);
})