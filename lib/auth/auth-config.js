export const AUTH_CONFIG = Object.freeze({
  providers: Object.freeze({
    google: true,
    emailOtp: true,
    magicLink: true,
  }),

  routes: Object.freeze({
    signIn: '/auth/sign-in',
    callback: '/auth/callback',
    confirm: '/auth/confirm',
    error: '/auth/error',
    dashboard: '/dashboard',
  }),

  session: Object.freeze({
    useCookies: true,
    serverVerification: 'getClaims',
    freshUserLookup: 'getUser',
  }),

  profile: Object.freeze({
    oneProfilePerUser: true,
    ownerField: 'owner_id',
  }),
});

export function isSupportedProvider(provider) {
  return provider === 'google' || provider === 'email';
}