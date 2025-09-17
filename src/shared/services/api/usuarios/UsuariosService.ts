import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListaUsuarios {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  phone: string | null;
  status: boolean;
  roles: IRole[];
}

export interface IRole {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
}


export interface IDetalleUsuarios {
    id?: number;
    name: string;
    email: string;
    phone?: string | null;
    photo?: string | null;
    status?: boolean;
}

type TContactoTotalCount = {
  data: IListaUsuarios[];
  totalCount: number;
}

  // const getAll = async (page = 1, filter = ''): Promise<TContactoTotalCount | Error> => {
  //   //const getAll = async (): Promise<TContactoTotalCount | Error> => {
  //   let usuarios: IListaUsuarios[];
  //   let total=0
  //   try {
  //     //const urlRelativa = `/adm/contactos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nombre_like=${filter}`;      
  //     //const urlRelativa = `/adm/contactos`;
  //     const url = '/users/list';

  //     const { data, headers } = await Api.get(url);
  //     //console.log("headers",headers);
  //     console.info("USERS RESPONSE: ", data);
  //     usuarios = data.data;
  //     total=data.paginacion.total_records
  //     if (data) {
  //       return {
  //         data: usuarios,
  //         totalCount: Number(total || Environment.LIMITE_DE_LINHAS),
  //       };
  //     }

  //     return new Error('Error al listar los usuarios');
  //   } catch (error) {
  //     console.error(error);
  //     return new Error((error as { message: string }).message || 'Error al listar los contactos');
  //   }
  // };

  const getAll = async (): Promise<{ data: IListaUsuarios[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/users/list');
        console.info("USERS RESPONSE: ", data);
        
        if (data) {
            return {
                data: data.data, // Aquí mapeamos la data recibida
                totalCount: data.data.length, // Asumiendo que no tienes paginación en el backend
            };
        }

        return new Error('Error al listar los usuarios');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar los usuarios');
    }
};


const getById = async (id: number): Promise<IDetalleUsuarios | Error> => {
  try {
      const { data } = await Api.get(`/users/find/${id}`);
      console.info("USER", data)
      if (data) {
          return data.data;
      }
      return new Error('Error al obtener un usuario');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener un usuario');
  }
};

const create = async (datos: Omit<IDetalleUsuarios, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      console.log('Creando nuevo usuario:', datos);
      const { data } = await Api.post<IDetalleUsuarios>('/users/create', datos);
      console.log('Respuesta del servidor:', data);
      if (data) {
          return data.id;
      }

      return new Error('Error al crear un usuario');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al crear un usuario');
  }
};

const updateById = async (id: number, datos: Omit<IDetalleUsuarios, 'status'>): Promise<void | Error> => {
  try {
      console.log('Actualizando usuario con ID', id, 'datos:', datos);
      await Api.put(`/users/update/${id}`, datos); // Usando la ruta correcta para usuarios
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al actualizar un usuario');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
      await Api.delete(`/users/delete/${id}`); // Usando la ruta correcta para usuarios
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al eliminar un usuario');
  }
};


export const UsuariosService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
