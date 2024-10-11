import { ListadoDetalle } from "src/app/interface/listado.model";

export enum TokenStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export interface AuthState {
  isLoggedIn: boolean;
  user?: AuthUser;
  accessTokenStatus: TokenStatus;
  refreshTokenStatus: TokenStatus;
  isLoadingLogin: boolean;
  hasLoginError: boolean;
}

export interface AuthUser {
  idUsuario: number;
  codigoRuc: string;
  numeroDocumento: string;
  razonSocial: string;
  correo: string;
  nombreUsuario: string;
  fechaInicioSesion: string;
  tipoDocumento: ListadoDetalle
  tipoPersona: ListadoDetalle
  roles: any
  nombreTipoNegocio: string
}