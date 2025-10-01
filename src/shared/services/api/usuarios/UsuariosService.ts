import { IRol } from '@/shared/types/Rol';
import { Api } from '../axios-config';
import { IUsuarioAlta, IUsuarioResponse } from '@/shared/types/Usuario';

export interface IDetalleUsuarios {
    id?: number;
    nombre: string;
    correo: string;
    password:string;
    estado?: boolean;
    roles: IRol[];
}

const getAll = async (): Promise<{ data: IUsuarioResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/usuarios/');
        console.info("USERS RESPONSE: ", data);
        
        if (data) {
            return {
                data: data, // Aquí mapeamos la data recibida
                totalCount: data.length, // Asumiendo que no tienes paginación en el backend
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
      const { data } = await Api.get(`/ad/usuarios/${id}/`);
      console.info("USER", data)
      if (data) {
          return data;
      }
      return new Error('Error al obtener un usuario');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener un usuario');
  }
};

const create = async (datos: Omit<IUsuarioAlta, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      console.log('Creando nuevo usuario:', datos);
      const { data } = await Api.post<IDetalleUsuarios>('/ad/usuarios/crear/', datos);
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

const updateById = async (id: number, datos: Omit<IUsuarioAlta, 'status'>): Promise<void | Error> => {
  try {
      console.log('Actualizando usuario con ID', id, 'datos:', datos);
      await Api.put(`/ad/usuarios/${id}/actualizar/`, datos); // Usando la ruta correcta para usuarios
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
