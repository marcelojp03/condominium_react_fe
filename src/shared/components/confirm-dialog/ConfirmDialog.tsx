import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export type ConfirmDialogType = 'warning' | 'error' | 'info' | 'success' | 'delete';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  showCancel?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const getTypeConfig = (type: ConfirmDialogType) => {
  const configs = {
    warning: {
      icon: <WarningIcon sx={{ fontSize: 60 }} />,
      color: 'warning.main',
      backgroundColor: 'warning.light',
      confirmButtonColor: 'warning' as const,
    },
    error: {
      icon: <ErrorIcon sx={{ fontSize: 60 }} />,
      color: 'error.main',
      backgroundColor: 'error.light',
      confirmButtonColor: 'error' as const,
    },
    info: {
      icon: <InfoIcon sx={{ fontSize: 60 }} />,
      color: 'info.main',
      backgroundColor: 'info.light',
      confirmButtonColor: 'info' as const,
    },
    success: {
      icon: <SuccessIcon sx={{ fontSize: 60 }} />,
      color: 'success.main',
      backgroundColor: 'success.light',
      confirmButtonColor: 'success' as const,
    },
    delete: {
      icon: <DeleteIcon sx={{ fontSize: 60 }} />,
      color: 'error.main',
      backgroundColor: 'error.light',
      confirmButtonColor: 'error' as const,
    },
  };

  return configs[type];
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  showCancel = true,
  maxWidth = 'sm',
  fullWidth = true,
  children,
  onConfirm,
  onCancel,
}) => {
  const config = getTypeConfig(type);

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onCancel();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {!loading && (
            <IconButton
              aria-label="close"
              onClick={handleCancel}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          py={2}
        >
          {/* Icon */}
          <Box
            sx={{
              color: config.color,
              mb: 2,
              opacity: 0.8,
            }}
          >
            {config.icon}
          </Box>

          {/* Message */}
          <DialogContentText
            sx={{
              fontSize: '1.1rem',
              color: 'text.primary',
              mb: children ? 2 : 0,
            }}
          >
            {message}
          </DialogContentText>

          {/* Additional content */}
          {children && (
            <Box sx={{ width: '100%', mt: 2 }}>
              {children}
            </Box>
          )}

          {/* Loading state alert */}
          {loading && (
            <Alert
              severity="info"
              sx={{ width: '100%', mt: 2 }}
              icon={<CircularProgress size={20} />}
            >
              Procesando solicitud...
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {showCancel && (
          <Button
            onClick={handleCancel}
            disabled={loading}
            color="inherit"
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          disabled={loading}
          color={config.confirmButtonColor}
          variant="contained"
          sx={{ minWidth: 100 }}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Hook for easier usage
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    type: ConfirmDialogType;
    confirmText: string;
    cancelText: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    loading: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirmDialog = React.useCallback((options: {
    title: string;
    message: string;
    type?: ConfirmDialogType;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setDialogState({
      open: true,
      title: options.title,
      message: options.message,
      type: options.type || 'warning',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      loading: false,
      onConfirm: async () => {
        setDialogState(prev => ({ ...prev, loading: true }));
        try {
          await options.onConfirm();
          hideConfirmDialog();
        } catch (error) {
          console.error('Error in confirm action:', error);
          setDialogState(prev => ({ ...prev, loading: false }));
        }
      },
      onCancel: () => hideConfirmDialog(),
    });
  }, []);

  const hideConfirmDialog = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false, loading: false }));
  }, []);

  const ConfirmDialogComponent = React.useCallback(() => (
    <ConfirmDialog
      open={dialogState.open}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      loading={dialogState.loading}
      onConfirm={dialogState.onConfirm}
      onCancel={dialogState.onCancel}
    />
  ), [dialogState]);

  return {
    showConfirmDialog,
    hideConfirmDialog,
    ConfirmDialogComponent,
  };
};