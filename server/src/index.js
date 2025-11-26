import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use((req, res, next) => {
    if (req.originalUrl === '/api/billing/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Database Connection
connectDB();

// Routes

// Stripe webhook needs raw body, so we should mount it BEFORE express.json() if possible, 
// OR use the express.raw middleware in the route definition (which we did).
// However, express.json() is likely already applied globally.
// Let's check if we can exclude webhook from global json parsing or if the route-specific middleware overrides it.
// Actually, it's safer to mount webhook route before express.json() if we can, 
// but since we are using router, we might need to be careful.
// For simplicity in this setup, let's just mount the router. 
// If express.json() consumes the stream, the raw middleware in the route won't work.
// We need to modify how express.json is used.

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('BrandForge API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
