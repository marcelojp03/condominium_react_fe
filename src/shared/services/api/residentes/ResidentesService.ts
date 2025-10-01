import { IRol, IRolAlta, IRolEdicion } from '@/shared/types/Rol';

import { Api } from '../axios-config';
import { IResidenteAlta, IResidenteResponse } from '@/shared/types/Residente';




  const getAll = async (): Promise<{ data: IResidenteResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/residentes/');        
        if (data) {

            return {
                data: data, 
                totalCount: data.length, 
            };

       
        }

        return new Error('Error al listar');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar..');
    }
};


const getById = async (id: number): Promise<IResidenteResponse | Error> => {
  try {
      const { data } = await Api.get(`/ad/residentes/${id}/`);
      if (data) {
          return data;
      }
      return new Error('Error al obtener datos');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener datos...');
  }
};

const create = async (datos: Omit<IResidenteAlta, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      const { data } = await Api.post<IRolAlta>('/ad/residentes/crear/', datos);      
      if (data) {
          return data.id;
      }

      return new Error('Error al crear');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al crear...');
  }
};

const updateById = async (id: number, datos: Omit<IResidenteAlta, 'status'>): Promise<void | Error> => {
  try {
      await Api.put(`/ad/residentes/${id}/actualizar/`, datos); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al actualizar');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
      await Api.delete(`/users/delete/${id}`); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al eliminar');
  }
};


export const ResidentesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};




