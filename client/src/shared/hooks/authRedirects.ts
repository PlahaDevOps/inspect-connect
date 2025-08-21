export function getHomeRouteForUser(
    role?: number,
    subscriptionStatus?: string
): string {
    if (role === 0) return "/admin/dashboard";
    if (role === 1) return "/client/dashboard";

    if (role === 2) {
        const isActive = subscriptionStatus === "active";
        return isActive ? "/inspector/dashboard" : "/subscriptions";
    }

    return "/";
}
