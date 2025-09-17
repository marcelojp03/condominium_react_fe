import { Api } from "../axios-config";

export interface ITallasList {
    id: number;
    name: string;
}

export interface ITallasDetail {
    id: number;
    name: string;
}

type TTallasTotalCount = {
  data: ITallasList[];
  totalCount: number;
}

  const getAll = async (page = 1, filter = ''): Promise<TTallasTotalCount| any | Error> => {
    //const getAll = async (): Promise<TContactoTotalCount | Error> => {
    let sizes: ITallasList[];
    //let total=0
    try {
    //   const url = `/adm/contactos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nombre_like=${filter}`;      
    const url = `/sizes/list`;

      const { data, headers } = await Api.get(url);
      console.info("CATEGORIAS", data);
      sizes = data.data;
    //   total = data.paginacion.total_records
      if (data) {
        return {
          data: sizes,
          //totalCount: Number(total || Environment.LIMITE_DE_LINHAS),
          totalCount: data.data.length,
        };
      }
      return new Error('Error al listar las categorias');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al listar las categorias');
    }
  };

// // const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
//   const getById = async (id: number): Promise<IDetalleContacto | Error> => {
//     try {
//       const { data } = await Api.get(`/adm/contactos/${id}`);
  
//       if (data) {
//         return data;
//       }
  
//       return new Error('Error al obtener un contacto');
//     } catch (error) {
//       console.error(error);
//       return new Error((error as { message: string }).message || 'Error al obtener un contacto');
//     }
//   };

// // const create = async (dados: Omit<IDetalhePessoa, 'id'>): Promise<number | Error> => {
//   const create = async (datos: Omit<IDetalleContacto, 'id'>): Promise<number | Error> => {
//     try {
//       console.log('Creando nuevo contacto:', datos);
//       const { data } = await Api.post<IDetalleContacto>('/adm/contactos/', datos);
//       console.log('Respuesta del servidor:', data);
//       if (data) {
//         return data.id;
//       }
  
//       return new Error('Error al crear un registro');
//     } catch (error) {
//       console.error(error);
//       return new Error((error as { message: string }).message || 'Error al crear un contacto');
//     }
//   };

// // const updateById = async (id: number, dados: IDetalhePessoa): Promise<void | Error> => {
//   const updateById = async (id: number, datos: IDetalleContacto): Promise<void | Error> => {
//     try {
//       console.log('Actualizando contacto con ID', id, 'datos:', datos);
//       await Api.put(`/adm/contactos/${id}`, datos);
//     } catch (error) {
//       console.error(error);
//       return new Error((error as { message: string }).message || 'Error al actualizar un contacto');
//     }
//   };

// const deleteById = async (id: number): Promise<void | Error> => {
  const deleteById = async (id: number): Promise<void | Error> => {
    try {
      await Api.delete(`/adm/contactos/${id}`);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro al eliminar un contacto');
    }
  };

export const TallasService = {
  getAll,
//   create,
//   getById,
//   updateById,
  deleteById,
};
