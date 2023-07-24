export type JwtPayloadWithRT = {
    // claims
    sub: string,
    username: string,
    
    // refresh token
    refreshToken: string,
}