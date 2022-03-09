import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FLOW_TYPE, OktaAuthService } from './okta-auth.service';
import { AuthState } from '@okta/okta-auth-js';
import { of } from 'rxjs';

describe('AppComponent', () => {
  const oktaAuthStateSpy = jasmine.createSpyObj<AuthState>([], {
    isAuthenticated: false,
    idToken: undefined
  });
  const oktaAuthServiceSpy = jasmine.createSpyObj<OktaAuthService>([
    'startIdxFlow', 'cancelIdxFlow', 'proceedIdxFlow', 'logout'
  ], {
    authState$: of(oktaAuthStateSpy)
  }) ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MenuComponentStub
      ],
      providers: [
        { provide: OktaAuthService, useValue: oktaAuthServiceSpy}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

@Component({
  selector: 'app-menu',
  template: ``
})
class MenuComponentStub {
  @Input() public isAuthenticated = false;
  @Output() public startFlow: EventEmitter<FLOW_TYPE> = new EventEmitter<FLOW_TYPE>();
  @Output() public logout: EventEmitter<void> = new EventEmitter<void>();
}

