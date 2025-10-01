

import { Api } from '../axios-config';
import { IAvisoAlta, IAvisoResponse } from '@/shared/types/Aviso';




  const getAll = async (): Promise<{ data: IAvisoResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/avisos/');        
        if (data) {

            return {
                data: data, 
                totalCount: data.length, 
            };

       
        }

        return new Error('Error al listar');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al zonas...');
    }
};


const getById = async (id: number): Promise<IAvisoResponse | Error> => {
  try {
      const { data } = await Api.get(`/ad/avisos/${id}/`);
      if (data) {
          return data;
      }
      return new Error('Error al obtener');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al obtener..');
  }
};





const create = async (datos: Omit<IAvisoAlta, 'id' | 'status'>): Promise<number | undefined | Error> => {
  try {
      const { data } = await Api.post<IAvisoAlta>('/ad/avisos/crear/', datos);      
      if (data) {
          return data.id;
      }

      return new Error('Error al crear ');
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al crear...');
  }
};

const updateById = async (id: number, datos: Omit<IAvisoAlta, 'status'>): Promise<void | Error> => {
  try {
      await Api.put(`/ad/avisos/${id}/actualizar/`, datos); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al actualizar')
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
      await Api.delete(`/users/delete/${id}`); 
  } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Error al eliminar')
  }
};




export const AvisosService = {
    getAll,
  create,
  getById,
  updateById,
  deleteById,
};




