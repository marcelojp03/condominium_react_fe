import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

export type StatusType = 
  | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'expired'
  | 'paid' | 'overdue' | 'partial' 
  | 'available' | 'occupied' | 'rented' | 'maintenance'
  | 'in_progress' | 'resolved'
  | 'low' | 'medium' | 'high' | 'urgent'
  | 'confirmed' | 'failed'
  | 'general' | 'meeting' | 'emergency'
  | 'plumbing' | 'electrical' | 'structural' | 'noise' | 'security' | 'cleaning' | 'other';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType;
  customLabel?: string;
}

const getStatusConfig = (status: StatusType) => {
  const configs = {
    // General status
    active: { 
      label: 'Activo', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    inactive: { 
      label: 'Inactivo', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    pending: { 
      label: 'Pendiente', 
      color: '#ed6c02', 
      backgroundColor: alpha('#ff9800', 0.12) 
    },
    completed: { 
      label: 'Completado', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    cancelled: { 
      label: 'Cancelado', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    expired: { 
      label: 'Expirado', 
      color: '#757575', 
      backgroundColor: alpha('#9e9e9e', 0.12) 
    },
    
    // Payment status
    paid: { 
      label: 'Pagado', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    overdue: { 
      label: 'Vencido', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    partial: { 
      label: 'Parcial', 
      color: '#ed6c02', 
      backgroundColor: alpha('#ff9800', 0.12) 
    },
    confirmed: { 
      label: 'Confirmado', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    failed: { 
      label: 'Fallido', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    
    // Unit status
    available: { 
      label: 'Disponible', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    occupied: { 
      label: 'Ocupado', 
      color: '#1976d2', 
      backgroundColor: alpha('#2196f3', 0.12) 
    },
    rented: { 
      label: 'Alquilado', 
      color: '#7b1fa2', 
      backgroundColor: alpha('#9c27b0', 0.12) 
    },
    maintenance: { 
      label: 'Mantenimiento', 
      color: '#ed6c02', 
      backgroundColor: alpha('#ff9800', 0.12) 
    },
    
    // Incident status
    in_progress: { 
      label: 'En Progreso', 
      color: '#1976d2', 
      backgroundColor: alpha('#2196f3', 0.12) 
    },
    resolved: { 
      label: 'Resuelto', 
      color: '#2e7d32', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    
    // Priority levels
    low: { 
      label: 'Baja', 
      color: '#388e3c', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    medium: { 
      label: 'Media', 
      color: '#f57c00', 
      backgroundColor: alpha('#ff9800', 0.12) 
    },
    high: { 
      label: 'Alta', 
      color: '#e64a19', 
      backgroundColor: alpha('#ff5722', 0.12) 
    },
    urgent: { 
      label: 'Urgente', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    
    // Notice types
    general: { 
      label: 'General', 
      color: '#1976d2', 
      backgroundColor: alpha('#2196f3', 0.12) 
    },
    meeting: { 
      label: 'Reunión', 
      color: '#7b1fa2', 
      backgroundColor: alpha('#9c27b0', 0.12) 
    },
    emergency: { 
      label: 'Emergencia', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    
    // Incident categories
    plumbing: { 
      label: 'Fontanería', 
      color: '#0277bd', 
      backgroundColor: alpha('#03a9f4', 0.12) 
    },
    electrical: { 
      label: 'Eléctrico', 
      color: '#f57c00', 
      backgroundColor: alpha('#ff9800', 0.12) 
    },
    structural: { 
      label: 'Estructural', 
      color: '#5d4037', 
      backgroundColor: alpha('#795548', 0.12) 
    },
    noise: { 
      label: 'Ruido', 
      color: '#7b1fa2', 
      backgroundColor: alpha('#9c27b0', 0.12) 
    },
    security: { 
      label: 'Seguridad', 
      color: '#d32f2f', 
      backgroundColor: alpha('#f44336', 0.12) 
    },
    cleaning: { 
      label: 'Limpieza', 
      color: '#388e3c', 
      backgroundColor: alpha('#4caf50', 0.12) 
    },
    other: { 
      label: 'Otro', 
      color: '#757575', 
      backgroundColor: alpha('#9e9e9e', 0.12) 
    },
  };

  return configs[status] || configs.other;
};

export const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  customLabel, 
  size = 'small',
  variant = 'filled',
  ...chipProps 
}) => {
  const config = getStatusConfig(status);
  
  return (
    <Chip
      label={customLabel || config.label}
      size={size}
      variant={variant}
      sx={{
        color: config.color,
        backgroundColor: config.backgroundColor,
        fontWeight: 500,
        border: variant === 'outlined' ? `1px solid ${config.color}` : 'none',
        '& .MuiChip-label': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        },
        ...chipProps.sx,
      }}
      {...chipProps}
    />
  );
};