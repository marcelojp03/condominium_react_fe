import { useEffect, useState } from 'react';
import { LinearProgress, Paper, Typography, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useNavigate, useParams } from 'react-router-dom';
import { useForm,Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UsuariosService } from '../../shared/services/api/usuarios/UsuariosService';

import { AvisosService } from '../../shared/services/api/avisos/AvisosService';
import { Snackbar, Alert } from "@mui/material"; // 👈 importar
import { IZonaResponse } from '@/shared/types/Zona';
import { ZonasService } from '@/shared/services/api/zonas/ZonasService';
import { IAvisoResponse } from '@/shared/types/Aviso';


const userSchema = z.object({
  titulo: z.string().min(1, 'Nombre es requerido'),
  contenido: z.string().min(1, 'Debe seleccionar una zona'),
  estado: z.enum(['activo', 'inactivo'], {
    required_error: 'El estado es requerido',
  }),
  
});

type UserFormData = z.infer<typeof userSchema>;

export const AvisosDetail: React.FC = () => {
  const { id = 'nuevo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');

  const [aviso, setAvisos] = useState<IAvisoResponse[]>([]);
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
      titulo: '',
      contenido: '',
      estado: 'activo',
    },
  });

  

useEffect(() => {
  if (id !== 'nuevo') {
    setIsLoading(true);

    AvisosService.getById(Number(id)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
        navigate('/unidades');
      } else {
        setNombre(result.titulo);

        reset({
          titulo: result.titulo || '',
          contenido: String(result.contenido) || '',          
          estado: result.estado === true ? 'activo' : 'inactivo',
        });

      }
    });
  } else {
    reset({
      titulo: '',
      contenido: '',
      estado: 'activo',
    });
  }
}, [id, setValue, reset, navigate]);

  const handleSave = (data: UserFormData, shouldClose: boolean = false) => {
  setIsLoading(true);
  const usuarioLogueado = localStorage.getItem("usuario_id");
  const payload = {
    ...data,
    estado: data.estado === 'activo',
    usuario_alta:usuarioLogueado,
    fecha_publicacion:'01/10/2024',
    id:0
  };

  console.log("handleSave::payload:",payload);

  if (id === 'nuevo') {
    AvisosService.create(payload).then((result) => {      
      console.log("handleSave::create::response:",result);
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {        
        if (shouldClose) {
          navigate('/unidades');
        } else {
          navigate(`/unidades/${result}`);
        }
      }
    });
  } else {
    
    AvisosService.updateById(Number(id), payload).then((result) => {      
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        setSuccessMessage("Unidad actualizada correctamente");
        if (shouldClose) {
          navigate('/unidades');
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
          alert('Registro eliminado con éxito!');
          navigate('/unidades');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nuevo' ? 'Nueva unidad' : nombre}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nuevo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'nuevo'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmSalvarEFechar={handleSubmit(onSubmitAndClose)}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate('/unidades')}
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
              {...register('titulo')}
              fullWidth
              variant="outlined"
              label="Titulo"
              disabled={isLoading}
              error={!!errors.titulo}
              helperText={errors.titulo?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('contenido')}
              fullWidth
              variant="outlined"
              label="Contenido"
              disabled={isLoading}
              error={!!errors.contenido}
              helperText={errors.contenido?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          


        



        </Grid>
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
