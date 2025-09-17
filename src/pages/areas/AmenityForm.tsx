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
  Chip,
  OutlinedInput,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCreateAmenity } from '../../shared/hooks/useAmenities';
import { LayoutBaseDePagina } from '../../shared/layouts';

// Zod validation schema
const amenitySchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  type: z.enum(['pool', 'gym', 'park', 'salon', 'barbecue', 'playground', 'parking', 'other'], {
    errorMap: () => ({ message: 'Selecciona un tipo válido' })
  }),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  capacity: z.number()
    .min(1, 'La capacidad debe ser al menos 1 persona')
    .max(500, 'La capacidad no puede ser mayor a 500 personas'),
  location: z.string()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(200, 'La ubicación no puede tener más de 200 caracteres'),
  operatingHours: z.object({
    start: z.string().min(1, 'Hora de apertura requerida'),
    end: z.string().min(1, 'Hora de cierre requerida'),
  }),
  availableDays: z.array(z.string()).min(1, 'Debe seleccionar al menos un día'),
  reservationRequired: z.boolean(),
  maxReservationHours: z.number()
    .min(1, 'Debe ser al menos 1 hora')
    .max(24, 'No puede ser mayor a 24 horas'),
  reservationFee: z.number()
    .min(0, 'La tarifa no puede ser negativa')
    .max(1000, 'La tarifa es muy alta'),
  rules: z.string()
    .max(1000, 'Las reglas no pueden tener más de 1000 caracteres')
    .optional(),
  maintenanceSchedule: z.string()
    .max(500, 'El cronograma no puede tener más de 500 caracteres')
    .optional(),
  status: z.enum(['active', 'maintenance', 'closed'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' })
  }),
  amenities: z.array(z.string()).optional(),
  contactPerson: z.string()
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .optional(),
  contactPhone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Formato de teléfono inválido')
    .optional(),
});

type AmenityFormData = z.infer<typeof amenitySchema>;

const daysOfWeek = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

const amenityFeatures = [
  'WiFi', 'Aire Acondicionado', 'Baños', 'Duchas', 'Vestidores', 
  'Equipos de Sonido', 'Iluminación', 'Estacionamiento', 'Seguridad', 
  'Primeros Auxilios', 'Mesas', 'Sillas', 'Parrillas'
];

export const AmenityForm: React.FC = () => {
  const createAmenityMutation = useCreateAmenity();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: '',
      type: 'other',
      description: '',
      capacity: 10,
      location: '',
      operatingHours: {
        start: '08:00',
        end: '18:00',
      },
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      reservationRequired: false,
      maxReservationHours: 4,
      reservationFee: 0,
      rules: '',
      maintenanceSchedule: '',
      status: 'active',
      amenities: [],
      contactPerson: '',
      contactPhone: '',
    },
  });

  const reservationRequired = watch('reservationRequired');

  const onSubmit = async (data: AmenityFormData) => {
    try {
      const amenityData = {
        condoId: 1, // This should come from props or context
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        operatingHours: `${data.operatingHours.start} - ${data.operatingHours.end}`,
        reservationRequired: data.reservationRequired,
        hourlyRate: data.reservationFee || 0,
        maintenanceDay: data.availableDays[0] || 'sunday',
        rules: data.rules || '',
      };
      await createAmenityMutation.mutateAsync(amenityData);
      reset();
      // Navigate back or show success message
    } catch (error) {
      console.error('Error saving amenity:', error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <LayoutBaseDePagina titulo="Nueva Área Común">
      <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
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
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre del Área"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Ej: Piscina Principal, Gimnasio, etc."
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
                    <InputLabel>Tipo de Área</InputLabel>
                    <Select {...field} label="Tipo de Área">
                      <MenuItem value="pool">Piscina</MenuItem>
                      <MenuItem value="gym">Gimnasio</MenuItem>
                      <MenuItem value="park">Parque</MenuItem>
                      <MenuItem value="salon">Salón de Eventos</MenuItem>
                      <MenuItem value="barbecue">Área de Asados</MenuItem>
                      <MenuItem value="playground">Área de Juegos</MenuItem>
                      <MenuItem value="parking">Estacionamiento</MenuItem>
                      <MenuItem value="other">Otro</MenuItem>
                    </Select>
                    {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Describe las características y facilidades del área..."
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
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Capacidad (personas)"
                    type="number"
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
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
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ubicación"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    placeholder="Ej: Planta Baja, Terraza, Piso 2..."
                  />
                )}
              />
            </Grid>

            {/* Operating Hours */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Horarios de Funcionamiento
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Controller
                name="operatingHours.start"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hora de Apertura"
                    type="time"
                    error={!!errors.operatingHours?.start}
                    helperText={errors.operatingHours?.start?.message}
                    InputLabelProps={{ shrink: true }}
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
                name="operatingHours.end"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hora de Cierre"
                    type="time"
                    error={!!errors.operatingHours?.end}
                    helperText={errors.operatingHours?.end?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="availableDays"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.availableDays}>
                    <InputLabel>Días Disponibles</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Días Disponibles" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip 
                              key={value} 
                              label={daysOfWeek.find(day => day.value === value)?.label} 
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {daysOfWeek.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.availableDays && (
                      <FormHelperText>{errors.availableDays.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Reservation Settings */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Configuración de Reservas
              </Typography>
            </Grid>

            <Grid size={12}>
              <Controller
                name="reservationRequired"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Requiere Reserva Previa"
                  />
                )}
              />
            </Grid>

            {reservationRequired && (
              <>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}>
                  <Controller
                    name="maxReservationHours"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Máximo Horas por Reserva"
                        type="number"
                        error={!!errors.maxReservationHours}
                        helperText={errors.maxReservationHours?.message}
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
                    name="reservationFee"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tarifa de Reserva"
                        type="number"
                        error={!!errors.reservationFee}
                        helperText={errors.reservationFee?.message}
                        InputProps={{
                          startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                        }}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {/* Additional Settings */}
            <Grid size={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Configuración Adicional
              </Typography>
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
                      <MenuItem value="active">Activo</MenuItem>
                      <MenuItem value="maintenance">En Mantenimiento</MenuItem>
                      <MenuItem value="closed">Cerrado</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
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
                name="amenities"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Facilidades</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Facilidades" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {amenityFeatures.map((feature) => (
                        <MenuItem key={feature} value={feature}>
                          {feature}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="rules"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Reglas de Uso"
                    multiline
                    rows={4}
                    error={!!errors.rules}
                    helperText={errors.rules?.message}
                    placeholder="Define las reglas y normas para el uso del área..."
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
                name="contactPerson"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Persona de Contacto"
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson?.message}
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
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Teléfono de Contacto"
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone?.message}
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
                  {isSubmitting ? 'Guardando...' : 'Crear Área Común'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LayoutBaseDePagina>
  );
};