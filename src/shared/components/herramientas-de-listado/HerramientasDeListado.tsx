import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

interface IHerramientasDeListadoProps {
  textoDeBusqueda?: string;
  mostrarInputBusqueda?: boolean;
  alCambiarTextoDeBusqueda?: (nuevoTexto: string) => void;
  textoBotonNuevo?: string;
  mostrarBotonNuevo?: boolean;
  alClicEnNuevo?: () => void;
}

export const HerramientasDeListado: React.FC<IHerramientasDeListadoProps> = ({
  textoDeBusqueda = '',
  mostrarInputBusqueda = false,
  alCambiarTextoDeBusqueda,
  textoBotonNuevo = 'Nuevo',
  mostrarBotonNuevo = true,
  alClicEnNuevo,
}) => {
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {mostrarInputBusqueda && (
        <TextField
          size="small"
          value={textoDeBusqueda}
          placeholder="Buscar..."
          onChange={(e) => alCambiarTextoDeBusqueda?.(e.target.value)}
        />
      )}

      <Box flex={1} display="flex" justifyContent="end">
        {mostrarBotonNuevo && (
          <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={alClicEnNuevo}
            endIcon={<Icon>add</Icon>}
          >
            {textoBotonNuevo}
          </Button>
        )}
      </Box>
    </Box>
  );
};