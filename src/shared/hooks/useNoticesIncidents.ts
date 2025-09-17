import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for notices
let mockNotices: Notice[] = [
  {
    id: 1,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    title: 'Mantenimiento de la piscina',
    content: 'Se informa que la piscina estará cerrada por mantenimiento el día lunes 15 de enero de 7:00 AM a 5:00 PM. Agradecemos su comprensión.',
    type: 'maintenance',
    priority: 'medium',
    publishDate: '2024-01-10T09:00:00Z',
    expiryDate: '2024-01-16T23:59:59Z',
    authorName: 'Administración',
    targetAudience: 'all_residents',
    isActive: true,
    attachments: [],
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 2,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    title: 'Reunión de propietarios',
    content: 'Se convoca a todos los propietarios a la reunión ordinaria que se realizará el sábado 20 de enero a las 10:00 AM en el salón de eventos. Orden del día: 1) Aprobación de presupuesto 2024, 2) Renovación del contrato de seguridad, 3) Varios.',
    type: 'meeting',
    priority: 'high',
    publishDate: '2024-01-08T08:00:00Z',
    expiryDate: '2024-01-21T23:59:59Z',
    authorName: 'María García - Administradora',
    targetAudience: 'owners_only',
    isActive: true,
    attachments: ['orden_del_dia.pdf', 'propuesta_presupuesto.xlsx'],
    createdAt: '2024-01-08T08:00:00Z',
  },
  {
    id: 3,
    condoId: 2,
    condoName: 'Residencial Bella Vista',
    title: 'Nuevas normas de seguridad',
    content: 'A partir del 1 de febrero, se implementarán nuevas medidas de seguridad: 1) Control de acceso con tarjeta magnética, 2) Registro obligatorio de visitantes, 3) Nuevo horario de portería 24/7.',
    type: 'general',
    priority: 'high',
    publishDate: '2024-01-25T10:00:00Z',
    expiryDate: '2024-02-28T23:59:59Z',
    authorName: 'Carlos Mendoza - Administrador',
    targetAudience: 'all_residents',
    isActive: true,
    attachments: ['manual_seguridad.pdf'],
    createdAt: '2024-01-25T10:00:00Z',
  },
];

// Mock data for incidents
let mockIncidents: Incident[] = [
  {
    id: 1,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    unitId: 1,
    unitNumber: 'A-101',
    reporterName: 'Juan Pérez',
    reporterPhone: '(+591) 7-123-4567',
    reporterEmail: 'juan.perez@email.com',
    title: 'Fuga de agua en baño',
    description: 'Se detectó una fuga de agua en la tubería del baño principal. El agua está filtrando hacia el departamento de abajo.',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    reportDate: '2024-01-28T14:30:00Z',
    assignedTo: 'Carlos Técnico',
    estimatedResolution: '2024-01-30T17:00:00Z',
    actualResolution: null,
    resolutionNotes: 'Se programó visita del plomero para mañana.',
    photos: ['fuga_1.jpg', 'fuga_2.jpg'],
    createdAt: '2024-01-28T14:30:00Z',
  },
  {
    id: 2,
    condoId: 1,
    condoName: 'Condominio Los Jardines',
    unitId: null,
    unitNumber: 'Área común',
    reporterName: 'María González',
    reporterPhone: '(+591) 7-234-5678',
    reporterEmail: 'maria.gonzalez@email.com',
    title: 'Luz del pasillo no funciona',
    description: 'La luz del pasillo del segundo piso no enciende desde hace 3 días.',
    category: 'electrical',
    priority: 'medium',
    status: 'resolved',
    reportDate: '2024-01-25T08:15:00Z',
    assignedTo: 'Luis Electricista',
    estimatedResolution: '2024-01-26T16:00:00Z',
    actualResolution: '2024-01-26T15:30:00Z',
    resolutionNotes: 'Se reemplazó el foco y se revisó el interruptor. Problema resuelto.',
    photos: ['pasillo_antes.jpg', 'pasillo_despues.jpg'],
    createdAt: '2024-01-25T08:15:00Z',
  },
  {
    id: 3,
    condoId: 3,
    condoName: 'Torre Mirador',
    unitId: 5,
    unitNumber: '1502',
    reporterName: 'Ana Rodríguez',
    reporterPhone: '(+591) 7-456-7890',
    reporterEmail: 'ana.rodriguez@email.com',
    title: 'Ruido excesivo del vecino',
    description: 'El vecino del departamento 1503 hace ruido excesivo después de las 22:00 horas, especialmente música alta.',
    category: 'noise',
    priority: 'low',
    status: 'pending',
    reportDate: '2024-01-29T23:45:00Z',
    assignedTo: null,
    estimatedResolution: null,
    actualResolution: null,
    resolutionNotes: null,
    photos: [],
    createdAt: '2024-01-29T23:45:00Z',
  },
];

export interface Notice {
  id: number;
  condoId: number;
  condoName: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'meeting' | 'emergency' | 'payment';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: string;
  expiryDate: string;
  authorName: string;
  targetAudience: 'all_residents' | 'owners_only' | 'tenants_only' | 'specific_units';
  isActive: boolean;
  attachments: string[];
  createdAt: string;
}

export interface Incident {
  id: number;
  condoId: number;
  condoName: string;
  unitId: number | null;
  unitNumber: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'structural' | 'noise' | 'security' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  reportDate: string;
  assignedTo: string | null;
  estimatedResolution: string | null;
  actualResolution: string | null;
  resolutionNotes: string | null;
  photos: string[];
  createdAt: string;
}

export interface CreateNoticeData {
  condoId: number;
  title: string;
  content: string;
  type: Notice['type'];
  priority: Notice['priority'];
  publishDate: string;
  expiryDate: string;
  authorName: string;
  targetAudience: Notice['targetAudience'];
  attachments?: string[];
}

export interface CreateIncidentData {
  condoId: number;
  unitId?: number;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  title: string;
  description: string;
  category: Incident['category'];
  priority: Incident['priority'];
  photos?: string[];
}

export interface UpdateIncidentData {
  id: number;
  status?: Incident['status'];
  assignedTo?: string;
  estimatedResolution?: string;
  actualResolution?: string;
  resolutionNotes?: string;
}

// Query keys
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...noticeKeys.lists(), { filters }] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...noticeKeys.details(), id] as const,
  byCondo: (condoId: number) => [...noticeKeys.lists(), 'byCondo', condoId] as const,
};

export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...incidentKeys.lists(), { filters }] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: number) => [...incidentKeys.details(), id] as const,
  byCondo: (condoId: number) => [...incidentKeys.lists(), 'byCondo', condoId] as const,
};

// Notice Hooks
export const useNotices = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: noticeKeys.list(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Apply filters if provided
      let filteredNotices = [...mockNotices];
      
      if (filters?.condoId) {
        filteredNotices = filteredNotices.filter(notice => notice.condoId === filters.condoId);
      }
      
      if (filters?.type) {
        filteredNotices = filteredNotices.filter(notice => notice.type === filters.type);
      }
      
      if (filters?.priority) {
        filteredNotices = filteredNotices.filter(notice => notice.priority === filters.priority);
      }
      
      if (filters?.active !== undefined) {
        filteredNotices = filteredNotices.filter(notice => notice.isActive === filters.active);
      }
      
      // Sort by publish date (newest first)
      filteredNotices.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      
      return filteredNotices;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useNotice = (id: number) => {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const notice = mockNotices.find(n => n.id === id);
      if (!notice) {
        throw new Error(`Aviso con ID ${id} no encontrado`);
      }
      return notice;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNoticeData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find condo name
      const condoName = data.condoId === 1 ? 'Condominio Los Jardines' :
                       data.condoId === 2 ? 'Residencial Bella Vista' :
                       data.condoId === 3 ? 'Torre Mirador' : 'Desconocido';
      
      const newNotice: Notice = {
        ...data,
        id: Math.max(...mockNotices.map(n => n.id)) + 1,
        condoName,
        attachments: data.attachments || [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      mockNotices.push(newNotice);
      return newNotice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noticeKeys.byCondo(data.condoId) });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Notice> & { id: number }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const index = mockNotices.findIndex(n => n.id === data.id);
      if (index === -1) {
        throw new Error(`Aviso con ID ${data.id} no encontrado`);
      }
      
      const updatedNotice = { ...mockNotices[index], ...data };
      mockNotices[index] = updatedNotice;
      
      return updatedNotice;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(noticeKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noticeKeys.byCondo(data.condoId) });
    },
  });
};

// Incident Hooks
export const useIncidents = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: incidentKeys.list(filters || {}),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Apply filters if provided
      let filteredIncidents = [...mockIncidents];
      
      if (filters?.condoId) {
        filteredIncidents = filteredIncidents.filter(incident => incident.condoId === filters.condoId);
      }
      
      if (filters?.category) {
        filteredIncidents = filteredIncidents.filter(incident => incident.category === filters.category);
      }
      
      if (filters?.status) {
        filteredIncidents = filteredIncidents.filter(incident => incident.status === filters.status);
      }
      
      if (filters?.priority) {
        filteredIncidents = filteredIncidents.filter(incident => incident.priority === filters.priority);
      }
      
      // Sort by report date (newest first)
      filteredIncidents.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
      
      return filteredIncidents;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useIncident = (id: number) => {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const incident = mockIncidents.find(i => i.id === id);
      if (!incident) {
        throw new Error(`Incidente con ID ${id} no encontrado`);
      }
      return incident;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIncidentData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Find condo name
      const condoName = data.condoId === 1 ? 'Condominio Los Jardines' :
                       data.condoId === 2 ? 'Residencial Bella Vista' :
                       data.condoId === 3 ? 'Torre Mirador' : 'Desconocido';
      
      // Find unit number if unitId provided
      const unitNumber = data.unitId ? 'A-101' : 'Área común'; // Mock data
      
      const newIncident: Incident = {
        ...data,
        id: Math.max(...mockIncidents.map(i => i.id)) + 1,
        condoName,
        unitId: data.unitId || null,
        unitNumber,
        status: 'pending',
        reportDate: new Date().toISOString(),
        assignedTo: null,
        estimatedResolution: null,
        actualResolution: null,
        resolutionNotes: null,
        photos: data.photos || [],
        createdAt: new Date().toISOString(),
      };
      
      mockIncidents.push(newIncident);
      return newIncident;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.byCondo(data.condoId) });
    },
  });
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateIncidentData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 450));
      
      const index = mockIncidents.findIndex(i => i.id === data.id);
      if (index === -1) {
        throw new Error(`Incidente con ID ${data.id} no encontrado`);
      }
      
      const updatedIncident = { ...mockIncidents[index], ...data };
      mockIncidents[index] = updatedIncident;
      
      return updatedIncident;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(incidentKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
    },
  });
};