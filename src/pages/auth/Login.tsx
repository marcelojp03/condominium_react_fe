import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAuthContext } from '../../shared/contexts';
import { useMenuContext } from '../../shared/contexts/MenuContext';




const loginSchema = z.object({
  correo: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { loadMenu } = useMenuContext();
  const { login } = useAuthContext(); // ✅ Usar el login del contexto
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta a la que intentaba acceder antes del login
  const from = (location.state as any)?.from?.pathname || '/condominio-dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // ✅ Usar el login del AuthContext
    const result = await login(data.correo, data.password);
    console.log("Login::response:", result);
    
    if (result instanceof Error) {
      alert(result.message);
    } else if (result?.codigo === 0) {
      // ✅ El AuthContext ya guardó el token
      loadMenu(); // Recarga el menú dinámico
      // Redirige a la página que intentaba acceder o al dashboard
      navigate(from, { replace: true });
    } else {
      alert(result?.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto', marginTop: 8 }}>
      <Typography variant="h5" gutterBottom>Iniciar sesión</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} component="div">
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('correo')}
              label="Correo"
              fullWidth
              variant="outlined"
              error={!!errors.correo}
              helperText={errors.correo?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <TextField
              {...register('password')}
              label="Contraseña"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Button type="submit" variant="contained" fullWidth>
              Entrar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
