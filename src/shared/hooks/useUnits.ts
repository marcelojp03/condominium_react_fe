import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for units
let mockUnits: Unit[] = [
  {
    id: 1,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    number: 'A-101',
    floor: 1,
    tower: 'Torre A',
    area: 85.5,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    ownerName: 'Juan Pérez',
    ownerPhone: '(+591) 7-123-4567',
    ownerEmail: 'juan.perez@email.com',
    status: 'occupied',
    monthlyFee: 450.00,
    createdAt: '2023-01-20T00:00:00Z',
  },
  {
    id: 2,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    number: 'A-102',
    floor: 1,
    tower: 'Torre A',
    area: 90.0,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    ownerName: 'María González',
    ownerPhone: '(+591) 7-234-5678',
    ownerEmail: 'maria.gonzalez@email.com',
    status: 'occupied',
    monthlyFee: 520.00,
    createdAt: '2023-01-22T00:00:00Z',
  },
  {
    id: 3,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    number: 'B-201',
    floor: 2,
    tower: 'Torre B',
    area: 75.0,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    ownerName: null,
    ownerPhone: null,
    ownerEmail: null,
    status: 'available',
    monthlyFee: 400.00,
    createdAt: '2023-01-25T00:00:00Z',
  },
  {
    id: 4,
    condoId: 2,
    condoName: 'Residencial Bella Vista',
    number: '301',
    floor: 3,
    tower: null,
    area: 110.0,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    ownerName: 'Carlos Mendoza',
    ownerPhone: '(+591) 7-345-6789',
    ownerEmail: 'carlos.mendoza@email.com',
    status: 'occupied',
    monthlyFee: 650.00,
    createdAt: '2023-02-28T00:00:00Z',
  },
  {
    id: 5,
    condoId: 3,
    condoName: 'Torre Mirador',
    number: '1502',
    floor: 15,
    tower: null,
    area: 95.0,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    ownerName: 'Ana Rodríguez',
    ownerPhone: '(+591) 7-456-7890',
    ownerEmail: 'ana.rodriguez@email.com',
    status: 'rented',
    monthlyFee: 580.00,
    createdAt: '2023-03-15T00:00:00Z',
  },
];

export interface Unit {
  id: number;
  condoId: number;
  condoName: string;
  number: string;
  floor: number;
  tower: string | null;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  ownerName: string | null;
  ownerPhone: string | null;
  ownerEmail: string | null;
  status: 'available' | 'occupied' | 'rented' | 'maintenance';
  monthlyFee: number;
  createdAt: string;
}

export interface CreateUnitData {
  condoId: number;
  number: string;
  floor: number;
  tower?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  monthlyFee: number;
}

export interface UpdateUnitData extends Partial<CreateUnitData> {
  id: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  status?: Unit['status'];
}

// Query keys
export const unitKeys = {
  all: ['units'] as const,
  lists: () => [...unitKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...unitKeys.lists(), { filters }] as const,
  details: () => [...unitKeys.all, 'detail'] as const,
  detail: (id: number) => [...unitKeys.details(), id] as const,
  byCondo: (condoId: number) => [...unitKeys.lists(), 'byCondo', condoId] as const,
};

// Hooks
export const useUnits = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: unitKeys.list(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Apply filters if provided
      let filteredUnits = [...mockUnits];
      
      if (filters?.condoId) {
        filteredUnits = filteredUnits.filter(unit => unit.condoId === filters.condoId);
      }
      
      if (filters?.status) {
        filteredUnits = filteredUnits.filter(unit => unit.status === filters.status);
      }
      
      // For now, return mock data
      // In the future: return unitsApi.getAll(filters);
      return filteredUnits;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUnitsByCondominium = (condoId: number) => {
  return useQuery({
    queryKey: unitKeys.byCondo(condoId),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, filter mock data
      // In the future: return unitsApi.getByCondoId(condoId);
      return mockUnits.filter(unit => unit.condoId === condoId);
    },
    enabled: !!condoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUnit = (id: number) => {
  return useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // For now, find in mock data
      // In the future: return unitsApi.getById(id);
      const unit = mockUnits.find(u => u.id === id);
      if (!unit) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
      }
      return unit;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUnitData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // For now, simulate creation
      // In the future: return unitsApi.create(data);
      
      // Find condo name for the new unit
      const condoName = data.condoId === 1 ? 'Condominio Los Jardines' :
                       data.condoId === 2 ? 'Residencial Bella Vista' :
                       data.condoId === 3 ? 'Torre Mirador' : 'Desconocido';
      
      const newUnit: Unit = {
        ...data,
        id: Math.max(...mockUnits.map(u => u.id)) + 1,
        condoName,
        tower: data.tower || null,
        ownerName: null,
        ownerPhone: null,
        ownerEmail: null,
        status: 'available',
        createdAt: new Date().toISOString(),
      };
      
      // Update mock data (in real app, this would be handled by the API)
      mockUnits.push(newUnit);
      
      return newUnit;
    },
    onSuccess: (data) => {
      // Invalidate and refetch units lists
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      // Invalidate condo-specific units
      queryClient.invalidateQueries({ queryKey: unitKeys.byCondo(data.condoId) });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUnitData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, simulate update
      // In the future: return unitsApi.update(data.id, data);
      const index = mockUnits.findIndex(u => u.id === data.id);
      if (index === -1) {
        throw new Error(`Unidad con ID ${data.id} no encontrada`);
      }
      
      const updatedUnit = { ...mockUnits[index], ...data };
      mockUnits[index] = updatedUnit;
      
      return updatedUnit;
    },
    onSuccess: (data) => {
      // Update specific unit in cache
      queryClient.setQueryData(unitKeys.detail(data.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.byCondo(data.condoId) });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // For now, simulate deletion
      // In the future: return unitsApi.delete(id);
      const index = mockUnits.findIndex(u => u.id === id);
      if (index === -1) {
        throw new Error(`Unidad con ID ${id} no encontrada`);
      }
      
      const deletedUnit = mockUnits[index];
      mockUnits.splice(index, 1);
      return { id, condoId: deletedUnit.condoId };
    },
    onSuccess: (data) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: unitKeys.detail(data.id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.byCondo(data.condoId) });
    },
  });
};