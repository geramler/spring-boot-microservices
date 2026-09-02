/**
 * Decode base64url to a JSON-parsed object.
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Extract realm roles from the access token's `realm_access.roles` claim.
 * Returns an array of role name strings.
 *
 * Keycloak stores realm roles inside `realm_access.roles` in the access token
 * and (when the 'roles' scope is used) in the ID token as well.
 * We decode the access token directly because react-oidc-context's
 * user.profile may not include realm_access depending on Keycloak config.
 */
export function getUserRoles(user) {
  // Try from profile first (may be populated from ID token or userinfo)
  const profileRoles = user?.profile?.realm_access?.roles;
  if (Array.isArray(profileRoles) && profileRoles.length > 0) {
    return profileRoles;
  }

  // Fallback: decode access_token
  const token = user?.access_token;
  if (!token) return [];

  const payload = decodeJwtPayload(token);
  if (!payload) return [];

  const realmAccess = payload.realm_access;
  if (realmAccess && Array.isArray(realmAccess.roles)) {
    return realmAccess.roles;
  }

  return [];
}