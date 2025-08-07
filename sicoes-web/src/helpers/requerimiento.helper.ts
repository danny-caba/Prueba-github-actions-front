import { RequerimientoDocumento } from "src/app/interface/requerimiento.model";

export function asignarNombresApellidos(req: any): any {
  const supervisora = req.requerimiento?.supervisora;
  const tipoDoc = supervisora?.tipoDocumento?.codigo;

  if (tipoDoc === 'DNI' || tipoDoc === 'CARNET_EXTRA') {
    req.nombresApellidos = [
      supervisora?.nombres,
      supervisora?.apellidoPaterno,
      supervisora?.apellidoMaterno
    ].filter(Boolean).join(' ');
  } else if (tipoDoc === 'RUC') {
    req.nombresApellidos = supervisora?.nombreRazonSocial || '';
  } else {
    req.nombresApellidos = '';
  }

  return req;
}