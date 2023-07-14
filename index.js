require('dotenv').config()
const express = require('express');
const coinbase = require('coinbase-commerce-node');
const axios = require('axios');
const Client = coinbase.Client;
// const resources = coinbase.resources;
// const Webhook = coinbase.Webhook;
// const bodyParser = require('body-parser');
const app = express()
Client.init(process.env.COINBASE_API_KEY);


// app.use(bodyParser.json())
// app.use(bodyParser.json({
//     verify: (req, res, buf) => {
//         const url = req.originalUrl;
//         if (url.startWith("/webhook")) {
//             req.rawBody = buf.toString();
//         }
//     }
// }))


// app.post("/checkout", async (req, res) => {
//     const { amount, currency } = req.body;
//     try {
//         const charge = await resources.Charge.create({
//             name: 'The Sovereign Individual',
//             description: 'Mastering the Transition to the Information Age',
//             pricing_type: 'fixed_price',
//             local_price: {
//                 amount: amount,
//                 currency: currency,
//             },
//             metadata: {
//                 userId: "22"
//             },
//             redirect_url: `http://159.223.51.198:5000/`,
//             cancel_url: `http://159.223.51.198:5000/#/dashboard`
//         })
//         console.log('Payment_Url :', charge.hosted_url)
//         res.status(200).json({
//             Payment_Url: charge.hosted_url,
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: error.message,
//         })
//     }
// })


// app.post("/webhooks", async (req, res) => {
//     try {
//         const event = Webhook.verifyEventBody(
//             req.rawBody,
//             req.headers["x-cc-webhook-signature"],
//             process.env.COINBASE_WEBHOOK_SECRET
//         );

//         if (event.type === "charge:confirmed") {
//             let amount = event.data.pricing.local.amount;
//             let currency = event.data.pricing.local.currency;
//             let userId = event.data.metadata.userId;

//             console.log(amount, currency, userId)
//         } else if (event.type === "charge:failed") {

//             const amount = event.data.pricing.local.amount;
//             const currency = event.data.pricing.local.currency;
//             const userId = event.data.metadata.userId;

//             console.log("Payment failed:", amount, currency, userId);
//         }
//         res.sendStatus(200)
//     } catch (error) {
//         res.status(500).json({
//             error: error,
//         })
//     }
// })

// app.listen(3000, () => {
//     console.log(`server is running on port 3000`)
// })



app.post('/create-payment', async (req, res) => {
    try {
        const chargeData = {
            name: 'Sample Charge',
            description: 'Sample description',
            pricing_type: 'fixed_price',
            local_price: {
                amount: '10.00',
                currency: 'USD',
            },
            metadata: {
                customer_id: '123',
            },
            redirect_url: 'http://159.223.51.198:5000/',
            cancel_url: 'http://159.223.51.198:5000/#/dashboard',
        };

        const response = await axios.post('https://api.commerce.coinbase.com/charges', chargeData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CC-Api-Key': '56874cc7-754c-4e3e-860e-30693c5d2cea'
            }
        });

        const charge = response.data.data;
        res.redirect(charge.hosted_url);
        console.log(charge.hosted_url)
    } catch (error) {
        console.error('Create payment error:', error.message);
        res.send('Error creating payment');
    }
});


app.get('/success', (req, res) => {
    console.log('Payment successful');
    res.send('Payment successful');
});

app.get('/cancel', (req, res) => {
    console.log('Payment canceled');
    res.send('Payment cancelled');
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
