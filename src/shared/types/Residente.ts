export interface IResidenteResponse {
  idresidente: number;
  unidad: number;
  codigo_unidad:string;
  nombres: string;
  apellido1: string;
  apellido2: string;
  tipo_documento: number;   
  numero_documento: string;
  extension_documento: string;
  correo_electronico: string;
  relacion: string;
  estado: boolean;
}

export interface IResidenteAlta {

  unidad: number;
  nombres: string;
  apellido1: string;
  apellido2: string;
  tipo_documento: number;   
  numero_documento: string;
  extension_documento: string;
  correo_electronico: string;
  relacion: string;
  estado: boolean;
}