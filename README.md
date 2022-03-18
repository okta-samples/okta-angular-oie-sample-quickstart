# Okta Angular OIE Sample App

This is an Angular sample app demonstrating OIE capabilities. This app supports (tested)

* Login with username/password
* Login with username/password + Email code or Magic Link
* Recover password
* Registration with Google authenticator, security question, email factor

Not supported

* Okta Verify
* Social login

## Getting going

```shell
git clone git@github.com:okta-samples/okta-angular-oie-sample-quickstart.git
cd okta-angular-oie-sample-quickstart
npm ci
```

Update `src/app/okta-config.ts` with your Okta application credentials.

To serve the app run 

```shell
npm start
ng serve --port=8080
```


## Run unit tests

```shell
npm run test
ng test
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5 and uses Okta AuthJS lib version 6.2.
