import { IRol } from "./Rol";

export interface IUsuarioAlta {
    id?: number;
    nombre: string;
    correo: string;
    password:string;
    estado?: boolean;
    rol_id?: number;
}

export interface IUsuarioResponse {
  id: number;
  nombre: string;
  correo: string;
  estado: boolean;
  data: IRol[];
}
