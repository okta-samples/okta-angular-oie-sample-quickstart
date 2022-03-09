import { TestBed } from '@angular/core/testing';

import { OktaAuthService } from './okta-auth.service';
import { AuthStateManager, IdxAPI, OktaAuth, TokenManager } from '@okta/okta-auth-js';
import { OKTA_AUTH } from './okta-config';
import { RouterTestingModule } from '@angular/router/testing';

describe('OktaAuthService', () => {
  let service: OktaAuthService;

  const authStateManagerSpy = jasmine.createSpyObj<AuthStateManager>(['subscribe', 'unsubscribe']);
  const tokenManagerSpy = jasmine.createSpyObj<TokenManager>(['setTokens']);
  const idxSpy = jasmine.createSpyObj<IdxAPI>([
    'startTransaction',
    'authenticate',
    'recoverPassword',
    'register',
    'proceed',
    'cancel',
    'handleEmailVerifyCallback',
    'handleInteractionCodeRedirect'
  ]);

  const oktaAuthSpy = jasmine.createSpyObj<OktaAuth>(['start', 'signOut', 'isLoginRedirect'], {
    authStateManager: authStateManagerSpy,
    idx: idxSpy,
    tokenManager: tokenManagerSpy
  });

  const docFake = {
    location: {
      search: 'some=params'
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: OKTA_AUTH, useValue: oktaAuthSpy }
      ]
    });
    service = TestBed.inject(OktaAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
