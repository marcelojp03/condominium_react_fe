import { useState } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { z } from 'zod';

import { useAuthContext } from '../../contexts';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

interface ILoginProps {
  children: React.ReactNode;
}
export const Login: React.FC<ILoginProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  
  const [error, setError] = useState(false); //Controls Alert
  const [message, setMessage] = useState('') //Controls Message
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const handleSubmit = () => {
    setIsLoading(true);
    setMessage('');
    setEmailError('');
    setPasswordError('');

    const validation = loginSchema.safeParse({ email, password });

    if (validation.success) {
      const validatedData = validation.data;
      login(validatedData.email, validatedData.password)
        .then((response) => {
          console.info(response);
          if (response.code == 0) {
            setMessage("Sesión iniciada correctamente");
            setError(false);
            setMessage('');
          } else if (response.code == 1) {
            setMessage(response.description);
            setError(true);
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      validation.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') {
          setEmailError(issue.message);
        } else if (issue.path[0] === 'password') {
          setPasswordError(issue.message);
        }
      });
    }
  };


  if (isAuthenticated) return (
    <>{children}</>
  );

  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>

      <Card>
        <CardContent>
          <Box display='flex' flexDirection='column' gap={2} width={250}>
            <Typography variant='h6' align='center'>Inicio de sesión</Typography>

            {/* Mostrar alerta si hay un mensaje */}
            {message && (
              <Alert variant="filled" severity={error ? 'error' : 'success'}>
                {message}
              </Alert>
            )}

            <TextField
              fullWidth
              variant='outlined'
              type='email'
              label='Correo'
              value={email}
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              onKeyDown={() => setEmailError('')}
              onChange={e => setEmail(e.target.value)}
            />

            {/* <TextField
              fullWidth
              variant='outlined'
              type='password'
              label='Contraseña'
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onKeyDown={() => setPasswordError('')}
              onChange={e => setPassword(e.target.value)}
            /> */}

          <FormControl fullWidth variant="outlined" error={!!passwordError}>
            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Contraseña'
                value={password}
                disabled={isLoading}
                error={!!passwordError}
                onKeyDown={() => setPasswordError('')}
                onChange={e => setPassword(e.target.value)}
              />
              {/* Mostrar el mensaje de error debajo del campo */}
              {!!passwordError && (
                  <FormHelperText>{passwordError}</FormHelperText>
              )}
          </FormControl>

          </Box>
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>

            <Button
              variant='contained'
              disabled={isLoading}
              onClick={handleSubmit}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Ingresar
            </Button>

          </Box>
        </CardActions> 
      </Card>
      
    </Box>

      
  );
};
