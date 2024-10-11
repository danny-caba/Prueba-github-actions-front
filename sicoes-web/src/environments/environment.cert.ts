const { version } = require('../../package.json');

export const environment = {
  production: false,
  usuarioInternos: false,
  usuarioExternos: true,
  loginSunat: 'https://certosiservicioslinea.osinergmin.gob.pe/osiservicioslinea/pages/inicio',
  appVersion: `${version}-cer`,

  //pathServe: 'https://srvcertsicoes02.osinergmin.gob.pe/sicoes-api',
  //apiOauth: 'https://srvcertsicoes02.osinergmin.gob.pe/sicoes-api',
  //apiUrl: 'https://srvcertsicoes02.osinergmin.gob.pe/sicoes-api',
  
  pathServe: 'https://srvcertsicoes.osinergmin.gob.pe/sicoes-api',
  apiOauth: 'https://srvcertsicoes.osinergmin.gob.pe/sicoes-api',
  apiUrl: 'https://srvcertsicoes.osinergmin.gob.pe/sicoes-api',

  clientConsumer: 'YXBwOjEyMzQ1'
};
