// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const { version } = require('../../package.json');

export const environment = {
  production: false,
  usuarioInternos: true,
  usuarioExternos: true,
  loginSunat: 'https://api-seguridad.sunat.gob.pe/v1/clientessol/dcdb35ac-3e61-4a90-aa82-58191e49af2a/oauth2/login?originalUrl=https://osiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/login.jsp&state=s',
  appVersion: `${version}-dev`,

  recaptcha: {
    siteKey: '6LcRBOwqAAAAAHISxc6xUVacKBhcYNKb2M8o2ocT'
  },

  //pathServe: 'http://localhost:8080',
  //apiOauth: 'http://localhost:8080',
  //apiUrl: 'http://localhost:8080',


  pathServe: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api', //'http://localhost:8080',
  apiOauth: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api',
  apiUrl: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api',


/*
  pathServe: 'http://132.251.202.210:9090/sicoes-api',
  apiOauth: 'http://132.251.202.210:9090/sicoes-api',
  apiUrl: 'http://132.251.202.210:9090/sicoes-api',
*/


/*pathServe: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api',
apiOauth: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api',
apiUrl: 'https://srvdesasicoes.osinergmin.gob.pe/sicoes-api',
*/

/*
pathServe: 'http://11.160.122.163:7003/sicoes-api',
apiOauth: 'http://11.160.122.163:7003/sicoes-api',
apiUrl: 'http://11.160.122.163:7003/sicoes-api',
*/

  clientConsumer: 'YXBwOjEyMzQ1'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
