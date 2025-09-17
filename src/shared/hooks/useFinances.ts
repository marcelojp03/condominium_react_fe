import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for fees
let mockFees: Fee[] = [
  {
    id: 1,
    unitId: 1,
    unitNumber: 'A-101',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'Juan Pérez',
    amount: 450.00,
    dueDate: '2024-01-31T23:59:59Z',
    status: 'paid',
    paidDate: '2024-01-28T10:30:00Z',
    paidAmount: 450.00,
    description: 'Cuota mensual enero 2024',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    unitId: 1,
    unitNumber: 'A-101',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'Juan Pérez',
    amount: 450.00,
    dueDate: '2024-02-29T23:59:59Z',
    status: 'overdue',
    paidDate: null,
    paidAmount: 0,
    description: 'Cuota mensual febrero 2024',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 3,
    unitId: 2,
    unitNumber: 'A-102',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'María González',
    amount: 520.00,
    dueDate: '2024-01-31T23:59:59Z',
    status: 'paid',
    paidDate: '2024-01-15T14:20:00Z',
    paidAmount: 520.00,
    description: 'Cuota mensual enero 2024',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock data for payments
let mockPayments: Payment[] = [
  {
    id: 1,
    feeId: 1,
    unitId: 1,
    unitNumber: 'A-101',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'Juan Pérez',
    amount: 450.00,
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN-2024-001-001',
    paymentDate: '2024-01-28T10:30:00Z',
    description: 'Pago cuota mensual enero 2024',
    status: 'confirmed',
    createdAt: '2024-01-28T10:30:00Z',
  },
  {
    id: 2,
    feeId: 3,
    unitId: 2,
    unitNumber: 'A-102',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'María González',
    amount: 520.00,
    paymentMethod: 'cash',
    transactionId: null,
    paymentDate: '2024-01-15T14:20:00Z',
    description: 'Pago cuota mensual enero 2024',
    status: 'confirmed',
    createdAt: '2024-01-15T14:20:00Z',
  },
];

// Mock data for fines
let mockFines: Fine[] = [
  {
    id: 1,
    unitId: 1,
    unitNumber: 'A-101',
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    ownerName: 'Juan Pérez',
    amount: 100.00,
    reason: 'Ruido excesivo después de las 22:00',
    issueDate: '2024-01-20T00:00:00Z',
    dueDate: '2024-02-20T23:59:59Z',
    status: 'pending',
    paidDate: null,
    description: 'Multa por incumplimiento del reglamento interno',
    createdAt: '2024-01-20T08:30:00Z',
  },
  {
    id: 2,
    unitId: 4,
    unitNumber: '301',
    condoId: 2,
    condoName: 'Residencial Bella Vista',
    ownerName: 'Carlos Mendoza',
    amount: 50.00,
    reason: 'Uso indebido del ascensor',
    issueDate: '2024-01-25T00:00:00Z',
    dueDate: '2024-02-25T23:59:59Z',
    status: 'paid',
    paidDate: '2024-02-10T16:45:00Z',
    description: 'Multa por mal uso de las instalaciones',
    createdAt: '2024-01-25T11:15:00Z',
  },
];

export interface Fee {
  id: number;
  unitId: number;
  unitNumber: string;
  condoId: number;
  condoName: string;
  ownerName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidDate: string | null;
  paidAmount: number;
  description: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  feeId: number;
  unitId: number;
  unitNumber: string;
  condoId: number;
  condoName: string;
  ownerName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card';
  transactionId: string | null;
  paymentDate: string;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface Fine {
  id: number;
  unitId: number;
  unitNumber: string;
  condoId: number;
  condoName: string;
  ownerName: string;
  amount: number;
  reason: string;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paidDate: string | null;
  description: string;
  createdAt: string;
}

export interface CreateFeeData {
  unitId: number;
  amount: number;
  dueDate: string;
  description: string;
}

export interface CreatePaymentData {
  feeId: number;
  amount: number;
  paymentMethod: Payment['paymentMethod'];
  transactionId?: string;
  paymentDate: string;
  description: string;
}

export interface CreateFineData {
  unitId: number;
  amount: number;
  reason: string;
  issueDate: string;
  dueDate: string;
  description: string;
}

// Query keys
export const financeKeys = {
  all: ['finance'] as const,
  fees: () => [...financeKeys.all, 'fees'] as const,
  payments: () => [...financeKeys.all, 'payments'] as const,
  fines: () => [...financeKeys.all, 'fines'] as const,
  feesList: (filters: Record<string, unknown>) => [...financeKeys.fees(), 'list', { filters }] as const,
  paymentsList: (filters: Record<string, unknown>) => [...financeKeys.payments(), 'list', { filters }] as const,
  finesList: (filters: Record<string, unknown>) => [...financeKeys.fines(), 'list', { filters }] as const,
  feeDetail: (id: number) => [...financeKeys.fees(), 'detail', id] as const,
  paymentDetail: (id: number) => [...financeKeys.payments(), 'detail', id] as const,
  fineDetail: (id: number) => [...financeKeys.fines(), 'detail', id] as const,
};

// Fees Hooks
export const useFees = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: financeKeys.feesList(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Apply filters if provided
      let filteredFees = [...mockFees];
      
      if (filters?.condoId) {
        filteredFees = filteredFees.filter(fee => fee.condoId === filters.condoId);
      }
      
      if (filters?.status) {
        filteredFees = filteredFees.filter(fee => fee.status === filters.status);
      }
      
      if (filters?.unitId) {
        filteredFees = filteredFees.filter(fee => fee.unitId === filters.unitId);
      }
      
      return filteredFees;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeeData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, simulate creation
      // Find unit info (in real app, this would come from the API)
      const unitInfo = {
        unitNumber: 'A-101', // Mock data
        condoId: 1,
        condoName: 'Condominio Los Jardines',
        ownerName: 'Juan Pérez',
      };
      
      const newFee: Fee = {
        ...data,
        id: Math.max(...mockFees.map(f => f.id)) + 1,
        ...unitInfo,
        status: 'pending',
        paidDate: null,
        paidAmount: 0,
        createdAt: new Date().toISOString(),
      };
      
      mockFees.push(newFee);
      return newFee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.fees() });
    },
  });
};

// Payments Hooks
export const usePayments = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: financeKeys.paymentsList(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Apply filters if provided
      let filteredPayments = [...mockPayments];
      
      if (filters?.condoId) {
        filteredPayments = filteredPayments.filter(payment => payment.condoId === filters.condoId);
      }
      
      if (filters?.status) {
        filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
      }
      
      if (filters?.unitId) {
        filteredPayments = filteredPayments.filter(payment => payment.unitId === filters.unitId);
      }
      
      return filteredPayments;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For now, simulate creation
      // Find fee and unit info (in real app, this would come from the API)
      const feeInfo = mockFees.find(f => f.id === data.feeId);
      if (!feeInfo) {
        throw new Error('Cuota no encontrada');
      }
      
      const newPayment: Payment = {
        ...data,
        id: Math.max(...mockPayments.map(p => p.id)) + 1,
        unitId: feeInfo.unitId,
        unitNumber: feeInfo.unitNumber,
        condoId: feeInfo.condoId,
        condoName: feeInfo.condoName,
        ownerName: feeInfo.ownerName,
        transactionId: data.transactionId || null,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      mockPayments.push(newPayment);
      
      // Update fee status
      const feeIndex = mockFees.findIndex(f => f.id === data.feeId);
      if (feeIndex !== -1) {
        mockFees[feeIndex] = {
          ...mockFees[feeIndex],
          status: 'paid',
          paidDate: data.paymentDate,
          paidAmount: data.amount,
        };
      }
      
      return newPayment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.payments() });
      queryClient.invalidateQueries({ queryKey: financeKeys.fees() });
    },
  });
};

// Fines Hooks
export const useFines = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: financeKeys.finesList(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Apply filters if provided
      let filteredFines = [...mockFines];
      
      if (filters?.condoId) {
        filteredFines = filteredFines.filter(fine => fine.condoId === filters.condoId);
      }
      
      if (filters?.status) {
        filteredFines = filteredFines.filter(fine => fine.status === filters.status);
      }
      
      if (filters?.unitId) {
        filteredFines = filteredFines.filter(fine => fine.unitId === filters.unitId);
      }
      
      return filteredFines;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useCreateFine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFineData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 450));
      
      // For now, simulate creation
      // Find unit info (in real app, this would come from the API)
      const unitInfo = {
        unitNumber: 'A-101', // Mock data
        condoId: 1,
        condoName: 'Condominio Los Jardines',
        ownerName: 'Juan Pérez',
      };
      
      const newFine: Fine = {
        ...data,
        id: Math.max(...mockFines.map(f => f.id)) + 1,
        ...unitInfo,
        status: 'pending',
        paidDate: null,
        createdAt: new Date().toISOString(),
      };
      
      mockFines.push(newFine);
      return newFine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.fines() });
    },
  });
};

export const usePayFine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fineId: number) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update fine status
      const fineIndex = mockFines.findIndex(f => f.id === fineId);
      if (fineIndex === -1) {
        throw new Error('Multa no encontrada');
      }
      
      mockFines[fineIndex] = {
        ...mockFines[fineIndex],
        status: 'paid',
        paidDate: new Date().toISOString(),
      };
      
      return mockFines[fineIndex];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.fines() });
    },
  });
};