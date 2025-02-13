import type { OAuth2Tokens } from "arctic";
import { Google, decodeIdToken } from "arctic";

export type IGoogleOAuthCallbackParams = {
  code: string | null;
  state: string | null;
  storedState: string | null;
  codeVerifier: string | null;
};

export type IGoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export async function handleOAuthCallBack(
  posted: IGoogleOAuthCallbackParams,
  googleConfig: IGoogleOAuthConfig,
): Promise<{ googleId: string; name: string; email: string } | null> {
  if (
    posted?.code === null ||
    posted?.state === null ||
    posted?.storedState === null ||
    posted?.codeVerifier === null
  ) {
    return null;
  }
  if (posted?.state !== posted?.storedState) {
    return null;
  }

  let tokens: OAuth2Tokens;
  try {
    const google = new Google(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri,
    );
    tokens = await google.validateAuthorizationCode(
      posted.code,
      posted.codeVerifier,
    );
  } catch (e) {
    // Invalid code or client credentials
    return null;
  }
  const claims: any = decodeIdToken(tokens.idToken());

  return {
    googleId: claims.sub,
    name: claims.name,
    email: claims.email,
  };
}
