import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useCondo, useCreateCondo, useUpdateCondo } from '../../shared/hooks/useCondos';
import { useSnackbar } from 'notistack';

// Zod schema for validation
const condoSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  totalUnits: z.number()
    .min(1, 'Debe tener al menos 1 unidad')
    .max(1000, 'No puede exceder 1000 unidades'),
  administrator: z.string()
    .min(1, 'El nombre del administrador es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[\+]?[\d\s\-\(\)]{8,20}$/, 'Formato de teléfono inválido'),
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
});

type CondoFormData = z.infer<typeof condoSchema>;

export const CondoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = Boolean(id);

  // Queries and mutations
  const { data: condo, isLoading: isLoadingCondo } = useCondo(Number(id));
  const createCondoMutation = useCreateCondo();
  const updateCondoMutation = useUpdateCondo();

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CondoFormData>({
    resolver: zodResolver(condoSchema),
    defaultValues: {
      name: '',
      address: '',
      totalUnits: 1,
      administrator: '',
      phone: '',
      email: '',
    },
    mode: 'onChange',
  });

  // Reset form when condo data loads
  React.useEffect(() => {
    if (condo) {
      reset({
        name: condo.name,
        address: condo.address,
        totalUnits: condo.totalUnits,
        administrator: condo.administrator,
        phone: condo.phone,
        email: condo.email,
      });
    }
  }, [condo, reset]);

  const onSubmit = async (data: CondoFormData) => {
    try {
      if (isEditing) {
        await updateCondoMutation.mutateAsync({
          id: Number(id),
          ...data,
        });
        enqueueSnackbar('Condominio actualizado exitosamente', { variant: 'success' });
      } else {
        await createCondoMutation.mutateAsync(data);
        enqueueSnackbar('Condominio creado exitosamente', { variant: 'success' });
      }
      navigate('/condominios');
    } catch (error) {
      enqueueSnackbar('Error al guardar el condominio', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('¿Estás seguro de que quieres descartar los cambios?')) {
        navigate('/condominios');
      }
    } else {
      navigate('/condominios');
    }
  };

  const isLoading = isLoadingCondo || createCondoMutation.isPending || updateCondoMutation.isPending;

  if (isEditing && isLoadingCondo) {
    return (
      <LayoutBaseDePagina titulo="Cargando...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </LayoutBaseDePagina>
    );
  }

  return (
    <LayoutBaseDePagina
      titulo={isEditing ? `Editar Condominio: ${condo?.name || ''}` : 'Nuevo Condominio'}
      barraDeHerramientas={
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Volver
          </Button>
        </Box>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información del Condominio
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Condominio"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="totalUnits"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      {...field}
                      label="Total de Unidades"
                      type="number"
                      fullWidth
                      required
                      value={value || ''}
                      onChange={(e) => onChange(Number(e.target.value) || 0)}
                      error={!!errors.totalUnits}
                      helperText={errors.totalUnits?.message}
                      disabled={isLoading}
                      inputProps={{ min: 1, max: 1000 }}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dirección"
                      fullWidth
                      required
                      multiline
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="administrator"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Administrador"
                      fullWidth
                      required
                      error={!!errors.administrator}
                      helperText={errors.administrator?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      fullWidth
                      required
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      disabled={isLoading}
                      placeholder="(+591) 3-123-4567"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isLoading}
                      placeholder="admin@condominio.com"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Error display */}
            {(createCondoMutation.isError || updateCondoMutation.isError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error al guardar el condominio. Por favor, intenta nuevamente.
              </Alert>
            )}

            {/* Submit button */}
            <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                disabled={!isValid || (!isDirty && isEditing) || isLoading}
              >
                {isLoading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear') + ' Condominio'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LayoutBaseDePagina>
  );
};