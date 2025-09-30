import { IRecurso } from "./Recurso";

export interface IRol {
  id: number;
  nombre: string;
  descripcion:string;
  estado:boolean;
  recursos: IRecurso[];
}
export interface IRolEdicion {

  nombre: string;
  descripcion:string;
  estado:boolean;
}
export interface IRolAlta {
  id:number
  nombre: string;
  descripcion:string;
  estado:boolean;
}