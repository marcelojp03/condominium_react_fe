export interface IAvisoResponse {
  idaviso: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string; 
  estado: boolean;
}

export interface IAvisoAlta {  
  id:number;  
  titulo: string;
  contenido: string;
  fecha_publicacion: string; 
  estado: boolean;
}