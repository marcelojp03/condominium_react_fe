import { Api } from '../axios-config';


export const MenuService = {
  getMenuByUsuarioId: async (usuario_id: number) => {
    try {
      const response = await Api.get(`/ad/menu/${usuario_id}/`);
      console.log("MenuService::response:",response);
      return response.data;
    } catch (error: any) {
      return new Error(error?.message || 'Error al cargar el menú');
    }
  },
};
