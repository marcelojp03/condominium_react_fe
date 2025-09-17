import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for condominiums
let mockCondos: Condo[] = [
  {
    id: 1,
    name: 'Condominio Los Jardines',
    address: 'Av. Principal 123, Zona Norte',
    totalUnits: 45,
    administrator: 'María García',
    phone: '(+591) 3-123-4567',
    email: 'admin@losjardines.com',
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    name: 'Residencial Bella Vista',
    address: 'Calle Los Álamos 456, Zona Sur',
    totalUnits: 32,
    administrator: 'Carlos Mendoza',
    phone: '(+591) 3-234-5678',
    email: 'admin@bellavista.com',
    status: 'active',
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 3,
    name: 'Torre Mirador',
    address: 'Av. Central 789, Centro',
    totalUnits: 78,
    administrator: 'Ana Rodríguez',
    phone: '(+591) 3-345-6789',
    email: 'admin@torremirador.com',
    status: 'active',
    createdAt: '2023-03-10T00:00:00Z',
  },
];

export interface Condo {
  id: number;
  name: string;
  address: string;
  totalUnits: number;
  administrator: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateCondoData {
  name: string;
  address: string;
  totalUnits: number;
  administrator: string;
  phone: string;
  email: string;
}

export interface UpdateCondoData extends Partial<CreateCondoData> {
  id: number;
}

// Query keys
export const condoKeys = {
  all: ['condos'] as const,
  lists: () => [...condoKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...condoKeys.lists(), { filters }] as const,
  details: () => [...condoKeys.all, 'detail'] as const,
  detail: (id: number) => [...condoKeys.details(), id] as const,
};

// Hooks
export const useCondos = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: condoKeys.list(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, return mock data
      // In the future: return condosApi.getAll(filters);
      return mockCondos;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCondo = (id: number) => {
  return useQuery({
    queryKey: condoKeys.detail(id),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, find in mock data
      // In the future: return condosApi.getById(id);
      const condo = mockCondos.find(c => c.id === id);
      if (!condo) {
        throw new Error(`Condominio con ID ${id} no encontrado`);
      }
      return condo;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateCondo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCondoData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, simulate creation
      // In the future: return condosApi.create(data);
      const newCondo: Condo = {
        ...data,
        id: Math.max(...mockCondos.map(c => c.id)) + 1,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      // Update mock data (in real app, this would be handled by the API)
      mockCondos.push(newCondo);
      
      return newCondo;
    },
    onSuccess: () => {
      // Invalidate and refetch condos list
      queryClient.invalidateQueries({ queryKey: condoKeys.lists() });
    },
  });
};

export const useUpdateCondo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCondoData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For now, simulate update
      // In the future: return condosApi.update(data.id, data);
      const index = mockCondos.findIndex(c => c.id === data.id);
      if (index === -1) {
        throw new Error(`Condominio con ID ${data.id} no encontrado`);
      }
      
      const updatedCondo = { ...mockCondos[index], ...data };
      mockCondos[index] = updatedCondo;
      
      return updatedCondo;
    },
    onSuccess: (data) => {
      // Update specific condo in cache
      queryClient.setQueryData(condoKeys.detail(data.id), data);
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: condoKeys.lists() });
    },
  });
};

export const useDeleteCondo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // For now, simulate deletion
      // In the future: return condosApi.delete(id);
      const index = mockCondos.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Condominio con ID ${id} no encontrado`);
      }
      
      mockCondos.splice(index, 1);
      return { id };
    },
    onSuccess: (data) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: condoKeys.detail(data.id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: condoKeys.lists() });
    },
  });
};