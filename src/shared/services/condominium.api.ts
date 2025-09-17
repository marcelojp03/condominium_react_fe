import { Api } from './api/axios-config';

// Condominios API
export const condosApi = {
  getAll: () => Api.get('/condos'),
  getById: (id: string) => Api.get(`/condos/${id}`),
  create: (data: any) => Api.post('/condos', data),
  update: (id: string, data: any) => Api.put(`/condos/${id}`, data),
  delete: (id: string) => Api.delete(`/condos/${id}`),
};

// Unidades API
export const unitsApi = {
  getAll: () => Api.get('/units'),
  getById: (id: string) => Api.get(`/units/${id}`),
  create: (data: any) => Api.post('/units', data),
  update: (id: string, data: any) => Api.put(`/units/${id}`, data),
  delete: (id: string) => Api.delete(`/units/${id}`),
};

// Amenities API
export const amenitiesApi = {
  getAll: () => Api.get('/amenities'),
  getById: (id: string) => Api.get(`/amenities/${id}`),
  create: (data: any) => Api.post('/amenities', data),
  update: (id: string, data: any) => Api.put(`/amenities/${id}`, data),
  delete: (id: string) => Api.delete(`/amenities/${id}`),
};