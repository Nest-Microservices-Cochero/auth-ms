
/// Opcional pero necesario definir como va a lucir nuestro JWT
export interface JwtPayload {
    id: string;
    email: string;
    name: string;
}