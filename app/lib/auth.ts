// Simple authentication utility
export const authorizedUsers = {
    'admin': {
        password: 'bookstore2024',
        role: 'admin',
        apiKey: 'amana-admin-key-2024'
    },
    'publisher': {
        password: 'publish123',
        role: 'publisher',
        apiKey: 'amana-publisher-key-2024'
    },
    'reviewer': {
        password: 'review456',
        role: 'reviewer',
        apiKey: 'amana-reviewer-key-2024'
    }
};

export function authenticate(request: Request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, error: 'Access denied. No API key provided.' };
    }

    const apiKey = authHeader.substring(7);
    const user = Object.entries(authorizedUsers).find(([username, data]) => data.apiKey === apiKey);

    if (!user) {
        return { success: false, error: 'Invalid API key' };
    }

    return {
        success: true,
        user: { username: user[0], role: user[1].role }
    };
}

export function requireRole(user: any, roles: string[]) {
    if (!roles.includes(user.role)) {
        return {
            success: false,
            error: `Access denied. Required roles: ${roles.join(', ')}`
        };
    }
    return { success: true };
}