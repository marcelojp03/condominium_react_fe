export interface ISubrecurso {
  id: number;
  nombre: string;
  descripcion: string;
  url: string;
  recurso: number;
}

export interface IRecurso {
  id: number;
  nombre: string;
  descripcion: string;
  subrecursos: ISubrecurso[];
}