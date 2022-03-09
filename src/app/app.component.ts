import { Component, OnInit } from '@angular/core';
import { FLOW_TYPE, OktaAuthService } from './okta-auth.service';
import {
  catchError, filter, iif, map,
  merge, mergeMap, Observable, of, shareReplay, Subject,
} from 'rxjs';
import { IdxMessage, NextStep } from '@okta/okta-auth-js';
import { FormTransformerService } from './form-transformer.service';
import { UserAction } from './dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [FormTransformerService]
})
export class AppComponent implements OnInit {

  public nextStep$!: Observable<NextStep|undefined>;
  public authState$ = this.oktaAuthService.authState$.pipe(shareReplay());
  public isAuthenticated$ = this.authState$.pipe(map(authState => authState?.isAuthenticated));
  public idToken$ = this.authState$.pipe(
    filter(authState => !!authState.idToken),
    map(authState => authState?.idToken)
  );

  public idxMessages$: Observable<IdxMessage[]> = this.oktaAuthService.idxTransactionMessages$;
  private flowSub$: Subject<FLOW_TYPE> = new Subject<FLOW_TYPE>();
  private inputSub$: Subject<UserAction> = new Subject<UserAction>();

  constructor(private oktaAuthService: OktaAuthService) { }

  public ngOnInit(): void {
    this.nextStep$ = merge(
      this.oktaAuthService.handleRedirects(),
      this.flowSub$.pipe(
        mergeMap((flow: FLOW_TYPE) => this.oktaAuthService.startIdxFlow(flow))
      ),
      this.inputSub$.pipe(
        mergeMap(input => iif(
              () => input.action === 'cancel',
              this.oktaAuthService.cancelIdxFlow(),
              this.oktaAuthService.proceedIdxFlow(input.values as {})
            )
        ),
      )
    ).pipe(
      catchError( error => {console.log(error); return of(undefined)}),
    );
  }

  public async onLogout(): Promise<void> {
    await this.oktaAuthService.logout();
  }

  public onInput(userInput: UserAction): void {
    this.inputSub$.next(userInput);
  }

  public onFlow(flow: FLOW_TYPE): void {
    this.flowSub$.next(flow);
  }
}
