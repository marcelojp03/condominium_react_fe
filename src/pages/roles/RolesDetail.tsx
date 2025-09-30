import { useEffect, useState } from 'react';
import { LinearProgress, Paper, Typography, TextField, MenuItem,Checkbox, FormControlLabel, FormGroup  } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useNavigate, useParams } from 'react-router-dom';
import { useForm,Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsuariosService } from '../../shared/services/api/usuarios/UsuariosService';

import { RolesService } from '../../shared/services/api/roles/RolesService';
import { RecursosService } from '../../shared/services/api/recursos/RecursosService';
import { Snackbar, Alert } from "@mui/material"; // 👈 importar
import { IRecurso } from '@/shared/types/Recurso';

// 📌 Esquema de validación con Zod
const userSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  descripcion: z.string(),
  estado: z.enum(['activo', 'inactivo'], {
    required_error: 'El estado es requerido',
  }),
  subrecursos: z.array(z.number()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export const RolesDetail: React.FC = () => {
  const { id = 'nuevo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [recursos, setRecursos] = useState<IRecurso[]>([]);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      estado: 'activo',
      subrecursos: [],
    },
  });

// 🔹 Cargar recursos con sus subrecursos
  useEffect(() => {
    RecursosService.getAll().then((result) => {
      if (!(result instanceof Error)) {
        setRecursos(result.data as IRecurso[]);
      }
    });
  }, []);

useEffect(() => {
  if (id !== 'nuevo') {
    setIsLoading(true);

    RolesService.getById(Number(id)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
        navigate('/roles');
      } else {
        setNombre(result.nombre);

          const subrecursosIds = result.recursos
          ?.flatMap((r: any) => r.subrecursos.map((s: any) => s.id)) || [];

        reset({
          nombre: result.nombre || '',
          descripcion: result.descripcion || '',
          estado: result.estado === true ? 'activo' : 'inactivo',
          subrecursos: subrecursosIds,
        });



      }
    });
  } else {
    reset({
      nombre: '',
      descripcion: '',
      estado: 'activo',
      subrecursos: [],
    });
  }
}, [id, setValue, reset, navigate]);

  const handleSave = (data: UserFormData, shouldClose: boolean = false) => {
  setIsLoading(true);

  // 🔹 Convertir estado a booleano antes de enviar al backend
  const payload = {
    ...data,
    estado: data.estado === 'activo',
    subrecursos: data.subrecursos,
  };

  if (id === 'nuevo') {
    
    RolesService.create(payload).then((result) => {
      
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        setSuccessMessage("✅ Rol registrado correctamente");
        if (shouldClose) {
          navigate('/roles');
        } else {
          navigate(`/roles/${result}`);
        }
      }
    });
  } else {
    
    RolesService.updateById(Number(id), payload).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        setSuccessMessage("✅ Rol actualizado correctamente");
        if (shouldClose) {
          navigate('/roles');
        }
      }
    });
  }
};

  const onSubmit = (data: UserFormData) => {
    
    handleSave(data, false);
  };

  const onSubmitAndClose = (data: UserFormData) => {
    handleSave(data, true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseas eliminar?')) {
      UsuariosService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Rol eliminado con éxito!');
          navigate('/roles');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nuevo' ? 'Nuevo rol' : nombre}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nuevo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'nuevo'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmSalvarEFechar={handleSubmit(onSubmitAndClose)}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate('/roles')}
        />
      }
    >
      <Paper
        component="form"
        sx={{ margin: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
        variant="outlined"
      >
        {isLoading && <LinearProgress variant="indeterminate" />}

        <Typography variant="h6">Información general</Typography>







        <Grid container spacing={2} component="div">
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('nombre')}
              fullWidth
              variant="outlined"
              label="Nombre"
              disabled={isLoading}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('descripcion')}
              fullWidth
              variant="outlined"
              label="Descripcion"
              disabled={isLoading}
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>




        <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Controller
              name="estado"
              control={control}
              defaultValue="activo"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  label="Estado"
                  disabled={isLoading}
                  error={!!errors.estado}
                  helperText={errors.estado?.message}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </TextField>
              )}
            />
          </Grid>




        </Grid>


 <Typography variant="h6" sx={{ mt: 2 }}>
          Permisos (Recursos y Subrecursos)
        </Typography>

        {/*  Un solo Controller maneja todos los checkboxes */}
        <Controller
          name="subrecursos"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <FormGroup>
              {recursos.map((recurso) => (
                <Paper key={recurso.id} sx={{ p: 2, mb: 2 }} variant="outlined">
                  <Typography variant="subtitle1">{recurso.nombre}</Typography>
                  {recurso.subrecursos.map((sub) => {
                    const value = field.value || [];
                    const checked = value.includes(sub.id);
                    return (
                      <FormControlLabel
                        key={sub.id}
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...value, sub.id]);
                              } else {
                                field.onChange(
                                  value.filter((v: number) => v !== sub.id)
                                );
                              }
                            }}
                          />
                        }
                        label={sub.nombre}
                      />
                    );
                  })}
                </Paper>
              ))}
            </FormGroup>
          )}
        />






      </Paper>


    <Snackbar
      open={!!successMessage}
      autoHideDuration={3000}
      onClose={() => setSuccessMessage(null)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={() => setSuccessMessage(null)}>
        {successMessage}
      </Alert>
    </Snackbar>

    </LayoutBaseDePagina>




  );
};
