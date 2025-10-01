import { IRol, IRolAlta, IRolEdicion } from '@/shared/types/Rol';
import { Api } from '../axios-config';

  const getAll = async (): Promise<{ data: IRol[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/roles/');
        console.info("ROLES RESPONSE: ", data);
        
        if (data) {

            return {
                data: data, // Aquí mapeamos la data recibida
                totalCount: data.length, // Asumiendo que no tienes paginación en el backend
            };

       
        }

        return new Error('Error al listar los roles');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar los roles');
    }
};


const getById = async (id: number): Promise<IRol | Error> => {
  try {
      const { data } = await Api.get(`/ad/roles/recursos/${id}/`);
      console.info("ROL::", data)
      if (data) {
          return data;
      }
      return new Error('Error al obtener un rol');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener un rol...');
  }
};

const create = async (datos: Omit<IRolAlta, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      console.log('Creando nuevo usuario:', datos);
      const { data } = await Api.post<IRolAlta>('/ad/usuarios/crear/', datos);
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

const updateById = async (id: number, datos: Omit<IRolEdicion, 'status'>): Promise<void | Error> => {
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


export const RolesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};




