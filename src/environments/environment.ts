// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase_config : {
    apiKey: 'AIzaSyDH0CirRvPmCSQt8qsEx4bLsm_urUqtTQE',
    authDomain: 'tmaster-d0da3.firebaseapp.com',
    databaseURL: 'https://tmaster-d0da3-default-rtdb.firebaseio.com/',
    projectId: 'tmaster-d0da3',
    storageBucket: 'tmaster-d0da3.appspot.com',
  },

  COGNITO_IDENTITY: {
    IDENTITY_POOL_ID: ""
  },
  S3: {
    accessKeyId: 'AKIAJRLIOBJDO2NBBLIQ',//'AKIATGI7CQBJGBQZQHO3',
    secretAccessKey: '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',//'bI4iam0Hvvo5GfGwHD2MD2XXiRrMGzOlj13O3ToY',
    region: 'ap-south-1', //'ap-northeast-1',
    bucketName: 'matukitestimg' //'tm-video-app'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
