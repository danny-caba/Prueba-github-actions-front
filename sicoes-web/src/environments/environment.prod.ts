const { version } = require('../../package.json');

export const environment = {
  production: true,
  usuarioInternos: false,
  usuarioExternos: false,
  loginSunat: 'https://osiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/login.jsp',
  appVersion: `${version}-pro`,
  
  recaptcha: {
    siteKey: '6LdSpOoqAAAAADEpaATcN7D1z11hK30Up7yloZkG',
  },

  pathServe: 'https://sicoes.osinergmin.gob.pe/sicoes-api',
  apiOauth: 'https://sicoes.osinergmin.gob.pe/sicoes-api',
  apiUrl: 'https://sicoes.osinergmin.gob.pe/sicoes-api',

  clientConsumer: 'YXBwOjEyMzQ1'
};
