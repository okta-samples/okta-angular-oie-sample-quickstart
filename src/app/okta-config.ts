import { OktaAuth } from '@okta/okta-auth-js';
import { FactoryProvider, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

const oidcConfig = {
  clientId: '{yourClientId}',
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

export const OKTA_AUTH = new InjectionToken('okta-auth');

const oktaAuthFactory = (router: Router, doc: any) => {
  const params = router.parseUrl(doc.location.search);
  const state = params.queryParamMap.get('state') ?? undefined;
  const recoveryToken = params.queryParamMap.get('recoveryToken') ?? undefined;
  const redirectUri = `${doc.location.origin}/login/callback`;
  return new OktaAuth({...oidcConfig, redirectUri, state, recoveryToken})
};

export const OKTA_PROVIDER: FactoryProvider = {
  provide: OKTA_AUTH,
  useFactory: oktaAuthFactory,
  deps: [Router, DOCUMENT]
}
