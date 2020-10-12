// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'http://localhost:3000',
  login: '/auth/login',
  register: '/auth/register',
  forgot: '/auth/forgot/password',
  reset: '/auth/reset/password',
  checkUser: '/users/user-exists',
  userInfo: '/auth/info',
  rooms: '/events',
  myEvents: '/events/my-events',
  twilioToken: '/twilio-api/access-token',
  requestPayment: '/order/pay',
  confirmPayment: '/order/confirm-payment',
  payDetails: '/payment/details',
  getPayDetails: '/payment/payment-details',
  requestPayout: '/payment/payouts',
  confirmPayout: '/payment/confirm/payouts',
  payPalBalance: '/payment/payout/amount',
  firebaseConfig : {
    apiKey: 'AIzaSyA5tylH8P8VTzNmj-b9GI3mr_y1wuibNIk',
    authDomain: 'joinaroom-64fd4.firebaseapp.com',
    databaseURL: 'https://joinaroom-64fd4.firebaseio.com',
    projectId: 'joinaroom-64fd4',
    storageBucket: 'joinaroom-64fd4.appspot.com',
    messagingSenderId: '1083370687682',
    appId: '1:1083370687682:web:2c02e6eeb3cd23d8677f5b',
    measurementId: 'G-81D2NQC8XW'
  },
  merchantInfo: '/merchant/info',
  merchantLinks: '/merchant/links',
  cashOutRequest: '/approve-payments',
  allUserEvents: '/events/all-payment-events'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
