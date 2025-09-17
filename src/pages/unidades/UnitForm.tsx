import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCreateUnit } from '../../shared/hooks/useUnits';
import { LayoutBaseDePagina } from '../../shared/layouts';

// Zod validation schema
const unitSchema = z.object({
  number: z.string()
    .min(1, 'El número es requerido')
    .max(10, 'El número no puede tener más de 10 caracteres'),
  floor: z.number()
    .min(1, 'El piso debe ser al menos 1')
    .max(50, 'El piso no puede ser mayor a 50'),
  type: z.enum(['apartment', 'penthouse', 'studio', 'duplex'], {
    errorMap: () => ({ message: 'Selecciona un tipo válido' })
  }),
  area: z.number()
    .min(20, 'El área debe ser al menos 20 m²')
    .max(1000, 'El área no puede ser mayor a 1000 m²'),
  bedrooms: z.number()
    .min(0, 'El número de dormitorios no puede ser negativo')
    .max(10, 'El número de dormitorios no puede ser mayor a 10'),
  bathrooms: z.number()
    .min(1, 'Debe tener al menos 1 baño')
    .max(10, 'El número de baños no puede ser mayor a 10'),
  hasBalcony: z.boolean(),
  hasParkingSpace: z.boolean(),
  condominiumId: z.string()
    .min(1, 'Selecciona un condominio'),
  status: z.enum(['available', 'occupied', 'maintenance', 'reserved'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' })
  }),
  ownerName: z.string()
    .min(2, 'El nombre del propietario debe tener al menos 2 caracteres')
    .max(100, 'El nombre del propietario no puede tener más de 100 caracteres')
    .optional(),
  ownerPhone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Formato de teléfono inválido')
    .optional(),
  ownerEmail: z.string()
    .email('Formato de email inválido')
    .optional(),
  monthlyMaintenanceFee: z.number()
    .min(0, 'La cuota de mantenimiento no puede ser negativa')
    .max(10000, 'La cuota de mantenimiento es muy alta'),
  notes: z.string()
    .max(500, 'Las notas no pueden tener más de 500 caracteres')
    .optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

export const UnitForm: React.FC = () => {
  const createUnitMutation = useCreateUnit();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      number: '',
      floor: 1,
      type: 'apartment',
      area: 50,
      bedrooms: 1,
      bathrooms: 1,
      hasBalcony: false,
      hasParkingSpace: false,
      condominiumId: '',
      status: 'available',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      monthlyMaintenanceFee: 0,
      notes: '',
    },
  });

  const onSubmit = async (data: UnitFormData) => {
    try {
      const unitData = {
        condoId: 1, // This should come from props or context
        number: data.number,
        floor: data.floor,
        area: data.area,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.hasParkingSpace ? 1 : 0,
        monthlyFee: data.monthlyMaintenanceFee,
      };
      await createUnitMutation.mutateAsync(unitData);
      reset();
      // Navigate back or show success message
    } catch (error) {
      console.error('Error saving unit:', error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <LayoutBaseDePagina titulo="Nueva Unidad">
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Información Básica
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Número de Unidad"
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    placeholder="Ej: 101, A-1, etc."
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="floor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Piso"
                    type="number"
                    error={!!errors.floor}
                    helperText={errors.floor?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel>Tipo de Unidad</InputLabel>
                    <Select {...field} label="Tipo de Unidad">
                      <MenuItem value="apartment">Apartamento</MenuItem>
                      <MenuItem value="penthouse">Penthouse</MenuItem>
                      <MenuItem value="studio">Estudio</MenuItem>
                      <MenuItem value="duplex">Dúplex</MenuItem>
                    </Select>
                    {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Estado</InputLabel>
                    <Select {...field} label="Estado">
                      <MenuItem value="available">Disponible</MenuItem>
                      <MenuItem value="occupied">Ocupada</MenuItem>
                      <MenuItem value="maintenance">Mantenimiento</MenuItem>
                      <MenuItem value="reserved">Reservada</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Property Details */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Detalles de la Propiedad
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Área (m²)"
                    type="number"
                    error={!!errors.area}
                    helperText={errors.area?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="bedrooms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Dormitorios"
                    type="number"
                    error={!!errors.bedrooms}
                    helperText={errors.bedrooms?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="bathrooms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Baños"
                    type="number"
                    error={!!errors.bathrooms}
                    helperText={errors.bathrooms?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="hasBalcony"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Tiene Balcón"
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="hasParkingSpace"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Tiene Estacionamiento"
                  />
                )}
              />
            </Grid>

            {/* Owner Information */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Información del Propietario
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre del Propietario"
                    error={!!errors.ownerName}
                    helperText={errors.ownerName?.message}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="ownerPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Teléfono"
                    error={!!errors.ownerPhone}
                    helperText={errors.ownerPhone?.message}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 4
              }}>
              <Controller
                name="ownerEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.ownerEmail}
                    helperText={errors.ownerEmail?.message}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="monthlyMaintenanceFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Cuota de Mantenimiento Mensual"
                    type="number"
                    error={!!errors.monthlyMaintenanceFee}
                    helperText={errors.monthlyMaintenanceFee?.message}
                    InputProps={{
                      startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                    }}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="condominiumId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.condominiumId}>
                    <InputLabel>Condominio</InputLabel>
                    <Select {...field} label="Condominio">
                      <MenuItem value="1">Torres del Sol</MenuItem>
                      <MenuItem value="2">Residencial Las Palmas</MenuItem>
                      <MenuItem value="3">Conjunto Mirador</MenuItem>
                      <MenuItem value="4">Edificio Central</MenuItem>
                    </Select>
                    {errors.condominiumId && (
                      <FormHelperText>{errors.condominiumId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Notas Adicionales"
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    placeholder="Información adicional sobre la unidad..."
                  />
                )}
              />
            </Grid>

            {/* Actions */}
            <Grid size={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Unidad'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LayoutBaseDePagina>
  );
};