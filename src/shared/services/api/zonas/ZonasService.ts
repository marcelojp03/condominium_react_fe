import { IRol, IRolAlta, IRolEdicion } from '@/shared/types/Rol';

import { Api } from '../axios-config';
import { IUnidadAlta, IUnidadResponse } from '@/shared/types/Unidad';
import { IZonaResponse } from '@/shared/types/Zona';


type TZonaTotalCount = {
  data: IZonaResponse[];
  totalCount: number;
}

  const getAll = async (): Promise<{ data: IZonaResponse[], totalCount: number } | Error> => {
    try {
        const { data } = await Api.get('/ad/zonas/');        
        if (data) {

            return {
                data: data, 
                totalCount: data.length, 
            };

       
        }

        return new Error('Error al listar zonas');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Error al listar  zonas...');
    }
};




export const ZonasService = {
  getAll,
};




