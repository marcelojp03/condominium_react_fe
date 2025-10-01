import { Api } from '../axios-config';
import { IRecurso } from '@/shared/types/Recurso';

  const getAll = async (): Promise<{ data: IRecurso[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/recursos/');
        console.info("RECURSOS RESPONSE: ", data);        
        if (data) {
            return {
                data: data, 
                totalCount: data.length, 
            };       
        }

        return new Error('Error al listar los recursos');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar los recursos');
    }
};




export const RecursosService = {
  getAll,
};




