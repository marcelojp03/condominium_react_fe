import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for amenities
let mockAmenities: Amenity[] = [
  {
    id: 1,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    name: 'Piscina',
    description: 'Piscina olímpica con área de recreación',
    capacity: 50,
    operatingHours: '06:00 - 22:00',
    reservationRequired: true,
    hourlyRate: 0, // Free for residents
    status: 'active',
    maintenanceDay: 'monday',
    rules: 'No se permite comida ni bebidas. Niños menores de 12 años deben estar acompañados.',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    name: 'Salón de Eventos',
    description: 'Salón para fiestas y eventos sociales',
    capacity: 80,
    operatingHours: '08:00 - 02:00',
    reservationRequired: true,
    hourlyRate: 150.00,
    status: 'active',
    maintenanceDay: 'tuesday',
    rules: 'Debe contratarse servicio de limpieza. Depósito de garantía requerido.',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 3,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    name: 'Gimnasio',
    description: 'Gimnasio equipado con máquinas de cardio y pesas',
    capacity: 15,
    operatingHours: '05:00 - 23:00',
    reservationRequired: false,
    hourlyRate: 0,
    status: 'active',
    maintenanceDay: 'sunday',
    rules: 'Uso de toalla obligatorio. Limpiar equipos después del uso.',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 4,
    condoId: 2,
    condoName: 'Residencial Bella Vista',
    name: 'Área de Juegos',
    description: 'Zona de juegos para niños con columpios y toboganes',
    capacity: 25,
    operatingHours: '06:00 - 20:00',
    reservationRequired: false,
    hourlyRate: 0,
    status: 'active',
    maintenanceDay: 'wednesday',
    rules: 'Niños menores de 8 años deben estar supervisados por un adulto.',
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 5,
    condoId: 3,
    condoName: 'Torre Mirador',
    name: 'Cancha de Tenis',
    description: 'Cancha de tenis profesional con iluminación',
    capacity: 4,
    operatingHours: '06:00 - 22:00',
    reservationRequired: true,
    hourlyRate: 50.00,
    status: 'maintenance',
    maintenanceDay: 'friday',
    rules: 'Uso de calzado deportivo obligatorio. Reservas máximo por 2 horas.',
    createdAt: '2023-03-10T00:00:00Z',
  },
];

export interface Amenity {
  id: number;
  condoId: number;
  condoName: string;
  name: string;
  description: string;
  capacity: number;
  operatingHours: string;
  reservationRequired: boolean;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'maintenance';
  maintenanceDay: string;
  rules: string;
  createdAt: string;
}

export interface CreateAmenityData {
  condoId: number;
  name: string;
  description: string;
  capacity: number;
  operatingHours: string;
  reservationRequired: boolean;
  hourlyRate: number;
  maintenanceDay: string;
  rules: string;
}

export interface UpdateAmenityData extends Partial<CreateAmenityData> {
  id: number;
  status?: Amenity['status'];
}

// Query keys
export const amenityKeys = {
  all: ['amenities'] as const,
  lists: () => [...amenityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...amenityKeys.lists(), { filters }] as const,
  details: () => [...amenityKeys.all, 'detail'] as const,
  detail: (id: number) => [...amenityKeys.details(), id] as const,
  byCondo: (condoId: number) => [...amenityKeys.lists(), 'byCondo', condoId] as const,
};

// Hooks
export const useAmenities = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: amenityKeys.list(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Apply filters if provided
      let filteredAmenities = [...mockAmenities];
      
      if (filters?.condoId) {
        filteredAmenities = filteredAmenities.filter(amenity => amenity.condoId === filters.condoId);
      }
      
      if (filters?.status) {
        filteredAmenities = filteredAmenities.filter(amenity => amenity.status === filters.status);
      }
      
      // For now, return mock data
      // In the future: return amenitiesApi.getAll(filters);
      return filteredAmenities;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAmenitiesByCondominium = (condoId: number) => {
  return useQuery({
    queryKey: amenityKeys.byCondo(condoId),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, filter mock data
      // In the future: return amenitiesApi.getByCondoId(condoId);
      return mockAmenities.filter(amenity => amenity.condoId === condoId);
    },
    enabled: !!condoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAmenity = (id: number) => {
  return useQuery({
    queryKey: amenityKeys.detail(id),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // For now, find in mock data
      // In the future: return amenitiesApi.getById(id);
      const amenity = mockAmenities.find(a => a.id === id);
      if (!amenity) {
        throw new Error(`Área común con ID ${id} no encontrada`);
      }
      return amenity;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAmenityData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For now, simulate creation
      // In the future: return amenitiesApi.create(data);
      
      // Find condo name for the new amenity
      const condoName = data.condoId === 1 ? 'Condominio Los Jardines' :
                       data.condoId === 2 ? 'Residencial Bella Vista' :
                       data.condoId === 3 ? 'Torre Mirador' : 'Desconocido';
      
      const newAmenity: Amenity = {
        ...data,
        id: Math.max(...mockAmenities.map(a => a.id)) + 1,
        condoName,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      // Update mock data (in real app, this would be handled by the API)
      mockAmenities.push(newAmenity);
      
      return newAmenity;
    },
    onSuccess: (data) => {
      // Invalidate and refetch amenities lists
      queryClient.invalidateQueries({ queryKey: amenityKeys.lists() });
      // Invalidate condo-specific amenities
      queryClient.invalidateQueries({ queryKey: amenityKeys.byCondo(data.condoId) });
    },
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAmenityData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 450));
      
      // For now, simulate update
      // In the future: return amenitiesApi.update(data.id, data);
      const index = mockAmenities.findIndex(a => a.id === data.id);
      if (index === -1) {
        throw new Error(`Área común con ID ${data.id} no encontrada`);
      }
      
      const updatedAmenity = { ...mockAmenities[index], ...data };
      mockAmenities[index] = updatedAmenity;
      
      return updatedAmenity;
    },
    onSuccess: (data) => {
      // Update specific amenity in cache
      queryClient.setQueryData(amenityKeys.detail(data.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: amenityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: amenityKeys.byCondo(data.condoId) });
    },
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, simulate deletion
      // In the future: return amenitiesApi.delete(id);
      const index = mockAmenities.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error(`Área común con ID ${id} no encontrada`);
      }
      
      const deletedAmenity = mockAmenities[index];
      mockAmenities.splice(index, 1);
      return { id, condoId: deletedAmenity.condoId };
    },
    onSuccess: (data) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: amenityKeys.detail(data.id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: amenityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: amenityKeys.byCondo(data.condoId) });
    },
  });
};