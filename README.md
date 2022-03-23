# Embedded Auth with SDKs Angular Sample Application

> :grey_exclamation: The use of this Sample uses an SDK that requires usage of the Okta Identity Engine. This functionality is in general availability but is being gradually rolled out to customers. If you want
to request to gain access to the Okta Identity Engine, please reach out to your account manager. If you do not have an account manager, please reach out to oie@okta.com for more information.

This app supports (tested)

* Login with username/password
* Login with username/password + Email code or Magic Link
* Recover password
* Registration with Google authenticator, security question, email factor

Not supported

* Okta Verify
* Social login

## Installation & Running The App

If you haven't done so already, register for a free account at [developer.okta.com](https://developer.okta.com/). Select **Create Free Account** and fill in the forms to complete the registration process. Once you are done and logged in, you will see your Okta Developer Console.

> **Tip**: You can also create an account using the [Okta CLI](https://github.com/oktadeveloper/okta-cli) and `okta register`. To create an app, run `okta apps create` and use the settings below.

Register your application by selecting **Applications** > **Add Application**. On the next screen, choose **SPA App** and click **Next**.

On the following screen, edit the application settings. For ExpressJS applications running in developer mode, the port number should be 8080. Configure your app as follows:

* **Initiate Login URI**: `http://localhost:4200`
* **Login redirect URI**: `http://localhost:4200/login/callback`
* **Logout redirect URI**: `http://localhost:4200`

By default the app server runs at `http://localhost:4200`.

The **issuer** is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-133337.okta.com/oauth2/default`.

Download the code sample by running 

```shell
git clone git@github.com:okta-samples/okta-angular-oie-sample-quickstart.git
cd okta-angular-oie-sample-quickstart
npm ci
```

Update `src/app/okta-config.ts` with your Okta application credentials.

To serve the app run 

```shell
npm start
```

To serve the app on a specified port, run

```shell
ng serve --port=8080
```

## Run unit tests

```shell
ng test
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5 and uses Okta AuthJS lib version 6.2.
