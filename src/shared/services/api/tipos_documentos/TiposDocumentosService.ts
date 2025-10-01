import { Api } from '../axios-config';
import { ITipoDocumentoResponse } from '@/shared/types/TipoDocumento';



  const getAll = async (): Promise<{ data: ITipoDocumentoResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/tipos-documento/');        
        if (data) {

            return {
                data: data, 
                totalCount: data.length, 
            };

       
        }

        return new Error('Error al listar');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar...');
    }
};


export const TiposDocumentosService = {
  getAll,
};




