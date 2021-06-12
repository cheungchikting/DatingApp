require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const paymentsession100 = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price_data: {
            currency: 'hkd',
            product_data: {
                name: 'LoveBetter Coins',
                images: ['https://images.unsplash.com/photo-1621859678777-dbff066f723e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2384&q=80'],
            },
            unit_amount: 100,
        },
        quantity: 100,
    }, ],
    mode: 'payment',
    success_url: `http://localhost:8000/success/100`,
    cancel_url: `http://localhost:8000/cancel`,
})

const paymentsession300 = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price_data: {
            currency: 'hkd',
            product_data: {
                name: 'LoveBetter Coins',
                images: ['https://images.unsplash.com/photo-1621859678777-dbff066f723e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2384&q=80'],
            },
            unit_amount: 90,
        },
        quantity: 300,
    }, ],
    mode: 'payment',
    success_url: `http://localhost:8000/success/300`,
    cancel_url: `http://localhost:8000/cancel`,
})

const paymentsession1000 = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price_data: {
            currency: 'hkd',
            product_data: {
                name: 'LoveBetter Coins',
                images: ['https://images.unsplash.com/photo-1621859678777-dbff066f723e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2384&q=80'],
            },
            unit_amount: 80,
        },
        quantity: 1000,
    }, ],
    mode: 'payment',
    success_url: `http://localhost:8000/success/1000`,
    cancel_url: `http://localhost:8000/cancel`,

})

async function checkstatus (paymentIntent){
    return await stripe.paymentIntents.retrieve(paymentIntent);
} 



module.exports = {
    '100': paymentsession100,
    '300': paymentsession300,
    '1000': paymentsession1000,
    'checkstatus': checkstatus
}