export { }

export type Tiers = "free" | "silver" | "gold" | "platinum"

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            tier?: Roles
        }
    }
}