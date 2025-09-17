import { useEffect, useState } from 'react';
import { LinearProgress, Paper, Typography, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsuariosService } from '../../shared/services/api/usuarios/UsuariosService';


// Esquema de validación con Zod
const userSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  phone: z.string().optional(),
  photo: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;


export const UsuariosDetail: React.FC = () => {
  const { id = 'nuevo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      photo: '',
    },
  });

  useEffect(() => {
    if (id !== 'nuevo') {
      setIsLoading(true);

      UsuariosService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/usuarios');
          } else {
            setNombre(result.name);
            // Poblar formulario con datos existentes
            setValue('name', result.name || '');
            setValue('email', result.email || '');
            setValue('phone', result.phone || '');
            setValue('photo', result.photo || '');
          }
        });
    } else {
      // Limpiar formulario para nuevo usuario
      reset({
        name: '',
        email: '',
        phone: '',
        photo: '',
      });
    }
  }, [id, setValue, reset, navigate]);

  const handleSave = (data: UserFormData, shouldClose: boolean = false) => {
    setIsLoading(true);

    if (id === 'nuevo') {
      UsuariosService.create(data)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (shouldClose) {
              navigate('/usuarios');
            } else {
              navigate(`/usuarios/detalle/${result}`);
            }
          }
        });
    } else {
      UsuariosService.updateById(Number(id), data)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (shouldClose) {
              navigate('/usuarios');
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
          UsuariosService.deleteById(id)
              .then(result => {
                  if (result instanceof Error) {
                      alert(result.message);
                  } else {
                      alert('Usuario eliminado con éxito!');
                      navigate('/usuarios');
                  }
              });
      }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nuevo' ? 'Nuevo usuario' : nombre}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nuevo'
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'nuevo'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmSalvarEFechar={handleSubmit(onSubmitAndClose)}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate('/usuarios')}
        />
      }
    >
      <Paper component="form" sx={{ margin: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }} variant="outlined">
        {isLoading && (
          <LinearProgress variant="indeterminate" />
        )}

        <Typography variant="h6">Información general</Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <TextField
              {...register('name')}
              fullWidth
              label="Nombre"
              disabled={isLoading}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              disabled={isLoading}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <TextField
              {...register('phone')}
              fullWidth
              label="Teléfono"
              disabled={isLoading}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <TextField
              {...register('photo')}
              fullWidth
              label="URL de foto"
              disabled={isLoading}
              error={!!errors.photo}
              helperText={errors.photo?.message}
            />
          </Grid>
        </Grid>
      </Paper>
    </LayoutBaseDePagina>
  );
};
