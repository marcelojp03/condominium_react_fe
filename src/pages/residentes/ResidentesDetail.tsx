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

import { ResidentesService } from '../../shared/services/api/residentes/ResidentesService';
import { Snackbar, Alert } from "@mui/material"; // 👈 importar
import { IZonaResponse } from '@/shared/types/Zona';
import { UnidadesService } from '@/shared/services/api/unidades/UnidadesService';
import { TiposDocumentosService } from '@/shared/services/api/tipos_documentos/TiposDocumentosService';
import { ITipoDocumentoResponse } from '@/shared/types/TipoDocumento';
import { IUnidadResponse } from '@/shared/types/Unidad';


const userSchema = z.object({
  nombres: z.string().min(1, 'Nombre es requerido'),
  apellido1: z.string().min(1, 'Apellido paterno es requerido'),
  apellido2: z.string(),
  unidad: z.string().min(1, 'Debe seleccionar la unidad habitacional'),
  tipo_documento: z.string().min(1, 'Debe seleccionar la unidad habitacional'),
  numero_documento: z.string(),
  correo_electronico: z.string().email('Email inválido').min(1, 'Email es requerido'),
  relacion:  z.string(),
  estado: z.enum(['activo', 'inactivo'], {
    required_error: 'El estado es requerido',
  }),
  
});

type UserFormData = z.infer<typeof userSchema>;

export const ResidentesDetail: React.FC = () => {
  const { id = 'nuevo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');

  const [tiposDocumentos, setTiposDocumentos] = useState<ITipoDocumentoResponse[]>([]);
  const [unidades, setUnidades] = useState<IUnidadResponse[]>([]);
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
      nombres: '',
      apellido1:'',
      apellido2:'',
      unidad: '',
      tipo_documento: '',
      numero_documento:'',
      correo_electronico:'',
      relacion:'Otro',
      estado: 'activo',
    },
  });

  useEffect(() => {
    TiposDocumentosService.getAll().then((result) => {
      if (!(result instanceof Error)) {
        setTiposDocumentos(result.data);
      }
    });
  }, []);

    useEffect(() => {
    UnidadesService.getAll().then((result) => {
      if (!(result instanceof Error)) {
        setUnidades(result.data);
      }
    });
  }, []);

useEffect(() => {
  if (id !== 'nuevo') {
    setIsLoading(true);

    ResidentesService.getById(Number(id)).then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
        navigate('/residentes');
      } else {
        setNombre(result.nombres);

        reset({
          nombres: result.nombres || '',
          apellido1: result.apellido1 || '',          
          apellido2: result.apellido1 || '',          
          unidad: String(result.unidad)|| '',          
          tipo_documento: String(result.tipo_documento)|| '',          
          numero_documento: result.numero_documento || '',          
          correo_electronico: result.correo_electronico || '',          
          relacion:result.relacion|| '',
          estado: result.estado === true ? 'activo' : 'inactivo',
        });

      }
    });
  } else {
    reset({
      nombres: '',
      apellido1:'',
      apellido2:'',
      unidad: '',
      tipo_documento: '',
      numero_documento:'',
      correo_electronico:'',
      relacion:'Otro',
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
    unidad:Number(data.unidad),
    tipo_documento:Number(data.tipo_documento),
    usuario_alta:usuarioLogueado,
    extension_documento:''
  };

  console.log("handleSave::payload:",payload);

  if (id === 'nuevo') {
    ResidentesService.create(payload).then((result) => {      
      console.log("handleSave::create::response:",result);
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {        
        if (shouldClose) {
          navigate('/residentes');
        } else {
          navigate(`/residentes/${result}`);
        }
      }
    });
  } else {
    
    ResidentesService.updateById(Number(id), payload).then((result) => {      
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        setSuccessMessage("Actualizado correctamente");
        if (shouldClose) {
          navigate('/residentes');
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
      ResidentesService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro eliminado con éxito!');
          navigate('/residentes');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nuevo' ? 'Nuevo residente' : nombre}
      barraDeHerramientas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nuevo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoApagar={id !== 'nuevo'}
          aoClicarEmSalvar={handleSubmit(onSubmit)}
          aoClicarEmSalvarEFechar={handleSubmit(onSubmitAndClose)}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate('/residentes')}
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
              {...register('nombres')}
              fullWidth
              variant="outlined"
              label="Nombre"
              disabled={isLoading}
              error={!!errors.nombres}
              helperText={errors.nombres?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('apellido1')}
              fullWidth
              variant="outlined"
              label="Apellido paterno"
              disabled={isLoading}
              error={!!errors.apellido1}
              helperText={errors.apellido1?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('apellido2')}
              fullWidth
              variant="outlined"
              label="Apellido materno"
              disabled={isLoading}
              error={!!errors.apellido2}
              helperText={errors.apellido2?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Controller
              name="tipo_documento"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Tipo documento de identidad"
                  variant="outlined"
                  disabled={isLoading}
                  error={!!errors.tipo_documento}
                  helperText={errors.tipo_documento?.message}
                  InputLabelProps={{ shrink: true }}
                >
                  {tiposDocumentos.map((item) => (
                    <MenuItem key={item.idtipo_documento_identidad} value={item.idtipo_documento_identidad.toString()}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('numero_documento')}
              fullWidth
              variant="outlined"
              label="Nro. documento"
              disabled={isLoading}
              error={!!errors.numero_documento}
              helperText={errors.numero_documento?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Controller
              name="unidad"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Unidad habitacional"
                  variant="outlined"
                  disabled={isLoading}
                  error={!!errors.unidad}
                  helperText={errors.unidad?.message}
                  InputLabelProps={{ shrink: true }}
                >
                  {unidades.map((item) => (
                    <MenuItem key={item.idunidad} value={item.idunidad.toString()}>
                      {item.codigo}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('correo_electronico')}
              fullWidth
              variant="outlined"
              label="Correo electronico"
              disabled={isLoading}
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Controller
              name="relacion"
              control={control}
              defaultValue="Otro"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  label="Relacion"
                  disabled={isLoading}
                  error={!!errors.relacion}
                  helperText={errors.relacion?.message}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="PROPIETARIO">Propietario</MenuItem>
                  <MenuItem value="INQUILINO">Inquilino</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </TextField>
              )}
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
