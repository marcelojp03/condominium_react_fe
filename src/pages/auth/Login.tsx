import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AuthService } from '../../shared/services/api/auth/AuthService';

import { useMenuContext } from '../../shared/contexts/MenuContext';




const loginSchema = z.object({
  correo: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { loadMenu } = useMenuContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await AuthService.auth(data.correo,data.password);
    console.log("Login::response:",result);
    if (result instanceof Error) {
      alert(result.message);
    } else {
      if(result.codigo===0){
          localStorage.setItem('token', result.token);
          localStorage.setItem('usuario_id', result.usuario_id);
          loadMenu(); // ✅ recarga el menú dinámico
          navigate('/condominio-dashboard');
      }else{
        alert(result.mensaje);
      }
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
