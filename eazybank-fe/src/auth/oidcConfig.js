// OIDC configuration for Keycloak Authorization Code Grant flow (PKCE)
export const oidcConfig = {
  // Keycloak OIDC authority URL
  authority: 'http://localhost:7080/realms/master',

  // Public client ID (must be created in Keycloak as a public client with
  // Standard Flow enabled, valid redirect URIs set to http://localhost:5173/*)
  client_id: 'eazybank-fe',

  // Where to redirect after login
  redirect_uri: 'http://localhost:5173/',

  // Where to redirect after logout
  post_logout_redirect_uri: 'http://localhost:5173/',

  // OpenID Connect scopes
  scope: 'openid profile email',

  // Use silent renew when token is about to expire
  automaticSilentRenew: true,

  // On sign-in, replace the current history entry (so user can't go back to login)
  onSigninCallback: (_user) => {
    // Clear the OIDC state from the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};