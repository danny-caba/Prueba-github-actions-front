const { version } = require('../../package.json');

export const environment = {
  production: true,
  usuarioInternos: false,
  usuarioExternos: false,
  loginSunat: 'https://osiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/login.jsp',
  appVersion: `${version}-pro`,

  pathServe: 'https://sicoes.osinergmin.gob.pe/sicoes-api',
  apiOauth: 'https://sicoes.osinergmin.gob.pe/sicoes-api',
  apiUrl: 'https://sicoes.osinergmin.gob.pe/sicoes-api',

  clientConsumer: 'YXBwOjEyMzQ1'
};
