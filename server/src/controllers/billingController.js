const Tenant = require('../models/Tenant');
const BillingEvent = require('../models/BillingEvent');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing. Billing features will not work.');
}

// Map plans to Stripe Price IDs (You should set these in .env)
const PLANS = {
    pro: process.env.STRIPE_PRICE_ID_PRO,
    enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE,
};

const createCheckoutSession = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ message: 'Stripe is not configured on the server.' });
    }

    const { plan, userId } = req.body; // userId passed from frontend, but we should use tenantId from auth if possible
    // However, for checkout, we might want to let the user specify which tenant (Org) they are upgrading.
    // For now, let's assume Personal upgrade (userId). 
    // TODO: Support Org upgrade by passing tenantId.
    const tenantId = userId; // Default to user for now

    if (!PLANS[plan]) {
        return res.status(400).json({ message: 'Invalid plan' });
    }

    try {
        let tenant = await Tenant.findOne({ tenantId });
        if (!tenant) {
            tenant = await Tenant.create({ tenantId, plan: 'free' });
        }

        // Create or get Stripe Customer
        let customerId = tenant.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                // email: user.email, // We might not have email in Tenant yet
                metadata: {
                    tenantId: tenantId,
                },
            });
            customerId = customer.id;
            tenant.stripeCustomerId = customerId;
            await tenant.save();
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PLANS[plan],
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
            metadata: {
                tenantId: tenantId,
                plan: plan,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createPortalSession = async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ message: 'Stripe is not configured on the server.' });
    }

    const { userId } = req.body; // TODO: Support tenantId
    const tenantId = userId;

    try {
        const tenant = await Tenant.findOne({ tenantId });
        if (!tenant || !tenant.stripeCustomerId) {
            return res.status(404).json({ message: 'Tenant or Stripe Customer not found' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: tenant.stripeCustomerId,
            return_url: `${process.env.CLIENT_URL}/settings`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Portal Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const handleWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(503).send('Stripe is not configured.');
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook Signature Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log event
    try {
        await BillingEvent.create({
            stripeEventId: event.id,
            type: event.type,
            data: event.data.object,
        });
    } catch (err) {
        // Ignore duplicate events
        if (err.code !== 11000) console.error('Error logging billing event:', err);
    }

    // Handle events
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const tenantId = session.metadata.tenantId;
                const plan = session.metadata.plan;

                await Tenant.findOneAndUpdate(
                    { tenantId: tenantId },
                    {
                        stripeCustomerId: session.customer,
                        subscriptionId: session.subscription,
                        plan: plan,
                        subscriptionStatus: 'active'
                    },
                    { upsert: true }
                );
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await Tenant.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    {
                        subscriptionStatus: subscription.status,
                        // Optionally update plan if they switched, but that's harder to infer directly without looking up price ID
                    }
                );
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await Tenant.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    {
                        subscriptionStatus: 'canceled',
                        plan: 'free'
                    }
                );
                break;
            }
        }
    } catch (err) {
        console.error('Error handling webhook event:', err);
        return res.status(500).send('Server Error');
    }

    res.json({ received: true });
};

module.exports = { createCheckoutSession, createPortalSession, handleWebhook };
