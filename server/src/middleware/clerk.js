import { ClerkExpressWithAuth as ClerkExpressWithAuthOriginal } from '@clerk/clerk-sdk-node';

export const ClerkExpressWithAuth = ClerkExpressWithAuthOriginal;

// Middleware to extract tenantId (orgId or userId)
export const setTenant = (req, res, next) => {
    // ClerkExpressWithAuth populates req.auth
    if (!req.auth) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, orgId } = req.auth;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No User ID' });
    }

    // Tenant ID is Org ID if present, otherwise User ID
    req.tenantId = orgId || userId;
    req.userId = userId;
    req.orgId = orgId;

    next();
};
