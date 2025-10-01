import { IRol, IRolAlta, IRolEdicion } from '@/shared/types/Rol';

import { Api } from '../axios-config';
import { IUnidadAlta, IUnidadResponse } from '@/shared/types/Unidad';


type TUnidadTotalCount = {
  data: IUnidadResponse[];
  totalCount: number;
}

  const getAll = async (): Promise<{ data: IUnidadResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/unidades/');        
        if (data) {

            return {
                data: data, 
                totalCount: data.length, 
            };

       
        }

        return new Error('Error al listar unidades');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar  unidades');
    }
};


const getById = async (id: number): Promise<IUnidadResponse | Error> => {
  try {
      const { data } = await Api.get(`/ad/unidades/${id}/`);
      if (data) {
          return data;
      }
      return new Error('Error al obtener unidad');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener unidad...');
  }
};

const create = async (datos: Omit<IUnidadAlta, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      const { data } = await Api.post<IUnidadAlta>('/ad/unidades/crear/', datos);      
      if (data) {
          return data.id;
      }

      return new Error('Error al crear unidad');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al crear unidad');
  }
};

const updateById = async (id: number, datos: Omit<IUnidadAlta, 'status'>): Promise<void | Error> => {
  try {
      await Api.put(`/ad/unidades/${id}/actualizar/`, datos); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al actualizar unidad');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
      await Api.delete(`/users/delete/${id}`); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al eliminar unidad');
  }
};


export const UnidadesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};




