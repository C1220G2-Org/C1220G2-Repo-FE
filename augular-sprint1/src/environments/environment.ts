// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  firebaseConfig: {
    apiKey: 'AIzaSyBjULnBU6qUT2QeLmnAVuHdj7MDnoQlO7w',
    authDomain: 'meeting-management-ec115.firebaseapp.com',
    databaseURL: 'https://meeting-management-ec115-default-rtdb.firebaseio.com',
    projectId: 'meeting-management-ec115',
    storageBucket: 'meeting-management-ec115.appspot.com',
    messagingSenderId: '38337192579',
    appId: '1:38337192579:web:d0835ea2d7c2dde63f71b6',
    measurementId: 'G-RVKTZKLWHT'
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
