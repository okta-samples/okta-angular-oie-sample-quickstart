import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  AuthState,
  hasErrorInUrl,
  IdxMessage,
  IdxStatus,
  IdxTransaction,
  NextStep,
  OktaAuth,
  Tokens
} from '@okta/okta-auth-js';
import {
  BehaviorSubject, defer,
  distinctUntilKeyChanged,
  filter,
  map,
  Observable, of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { Router } from '@angular/router';
import { OKTA_AUTH } from './okta-config';
import { DOCUMENT } from '@angular/common';

export interface AppAuthState {
  transaction: IdxTransaction | undefined;
  authState: AuthState;
}

const defaultAppAuthState: AppAuthState = {
  authState: {
    isAuthenticated: false
  },
  transaction: undefined
}

export type FLOW_TYPE = 'authenticate' | 'recoverPassword' | 'register' | 'idp';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthService implements OnDestroy {
  private destroySub$: Subject<void> = new Subject<void>();
  private appAuthStateSub$: BehaviorSubject<AppAuthState> = new BehaviorSubject<AppAuthState>(defaultAppAuthState);

  public authState$: Observable<AuthState> = this.appAuthStateSub$.asObservable().pipe(
    map(appAuthState => appAuthState.authState),
  );
  public idxTransactionMessages$: Observable<IdxMessage[]> = this.appAuthStateSub$.asObservable().pipe(
    map(appAuthState => appAuthState.transaction?.messages as IdxMessage[])
  );

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router, @Inject(DOCUMENT) private doc: Document) {
    this.authStateHandler = this.authStateHandler.bind(this);
    this.oktaAuth.authStateManager.subscribe(this.authStateHandler);
    this.oktaAuth.start();

    this.appAuthStateSub$.asObservable().pipe(
      filter(state => !!state.transaction),
      distinctUntilKeyChanged('transaction'),
      map(state => state.transaction as IdxTransaction),
      takeUntil(this.destroySub$)
    ).subscribe(transaction => console.log(transaction));

    this.appAuthStateSub$.asObservable().pipe(
      filter(state => !!state.transaction && !!state.transaction.tokens),
      map(state => state.transaction?.tokens as Tokens),
      takeUntil(this.destroySub$)
    ).subscribe(tokens => this.oktaAuth.tokenManager.setTokens(tokens))
  }

  public startIdxFlow(flow: FLOW_TYPE): Observable<NextStep | undefined> {
    return defer(() => flow === 'idp' ? this.oktaAuth.idx.startTransaction() : this.oktaAuth.idx[flow]()).pipe(
      map(transaction => this.transactionStateHandler(transaction))
    );
  }

  public cancelIdxFlow(): Observable<NextStep | undefined> {
    return defer(() => this.oktaAuth.idx.cancel()).pipe(
      map(transaction => this.transactionStateHandler(transaction)),
    );
  }

  public proceedIdxFlow(inputValues: {}): Observable<NextStep | undefined> {
    return defer(() => this.oktaAuth.idx.proceed(inputValues)).pipe(
      map(transaction => this.transactionStateHandler(transaction))
    );
  }

  public handleRedirects(): Observable<NextStep | undefined> {
    const {href, search} = this.doc.location;
    if(!href.includes('/login/callback')) {
      return of(undefined);
    }

    this.router.navigateByUrl('/');

    if (hasErrorInUrl(search)) {
      const query = this.router.parseUrl(search).queryParamMap;
      throw new Error(`${query.get('error')}: ${query.get('error_description')}`);
    }

    if (this.oktaAuth.idx.isEmailVerifyCallback(href)) {
      return defer(() => this.oktaAuth.idx.handleEmailVerifyCallback(search)).pipe(
        map(transaction => this.transactionStateHandler(transaction as IdxTransaction))
      );
    }

    return of(undefined);
  }

  public async logout(): Promise<void> {
    await this.oktaAuth.signOut();
  }

  public ngOnDestroy(): void {
    this.oktaAuth.authStateManager.unsubscribe(this.authStateHandler)
    this.destroySub$.next();
    this.destroySub$.complete();
    this.appAuthStateSub$.next(defaultAppAuthState);
    this.appAuthStateSub$.complete();
  }

  private transactionStateHandler(transaction: IdxTransaction): NextStep | undefined {
    const appState = this.appAuthStateSub$.getValue();
    this.appAuthStateSub$.next({...appState, transaction});

    const status = transaction.status;
    if (status === IdxStatus.SUCCESS || status === IdxStatus.CANCELED) {
      return undefined;
    }

    if (transaction.status === IdxStatus.FAILURE) {
      throw 'Idx error';
    }

    return transaction.nextStep;
  }

  private authStateHandler(authState: AuthState): void {
    const appState = this.appAuthStateSub$.getValue();
    this.appAuthStateSub$.next({...appState, authState});
  }
}
