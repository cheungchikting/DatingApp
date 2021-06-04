require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const paymentsession = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price_data: {
            currency: 'hkd',
            product_data: {
                name: 'SLY Coins',
                images: ['https://images.unsplash.com/photo-1621859678777-dbff066f723e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2384&q=80'],
            },
            unit_amount: 100,
        },
        quantity: 300,
    }, ],
    mode: 'payment',
    success_url: `http://localhost:8000/success`,
    cancel_url: `http://localhost:8000/cancel`,
})

module.exports = paymentsession;