export interface UserDataResponse {
  tipo_documento: string;
  documento: string;
  nombre: string;
  correo: string;
  cargo: string;
  area: string;
  lider: string;
  lider_correo: string;
  id_zentown: string;
  id_cargo: string;
  id_area: string;
  avatar: string;
  token: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  lastname: string;
  role: string;
  status: boolean;
  username: string;
  avatar: string;
}
