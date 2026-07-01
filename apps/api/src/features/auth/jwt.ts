import { jwtVerify, SignJWT } from "jose";

const issuer = "sweed-api";
const audience = "sweed-web";

export interface SessionClaims {
  userId: string;
  email: string;
}

export async function issueSessionToken(claims: SessionClaims, secret: Uint8Array): Promise<string> {
  return new SignJWT({
    email: claims.email
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifySessionToken(token: string, secret: Uint8Array): Promise<SessionClaims | null> {
  try {
    const result = await jwtVerify(token, secret, { issuer, audience });
    const userId = result.payload.sub;
    const email = result.payload.email;

    if (!userId || typeof email !== "string") {
      return null;
    }

    return { userId, email };
  } catch {
    return null;
  }
}

