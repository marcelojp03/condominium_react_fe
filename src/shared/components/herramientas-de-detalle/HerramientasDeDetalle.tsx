import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';


interface IHerramientasDeDetalleProps {
  textoBotonNuevo?: string;

  mostrarBotonNuevo?: boolean;
  mostrarBotonVolver?: boolean;
  mostrarBotonEliminar?: boolean;
  mostrarBotonGuardar?: boolean;
  mostrarBotonGuardarYCerrar?: boolean;

  mostrarBotonNuevoCargando?: boolean;
  mostrarBotonVolverCargando?: boolean;
  mostrarBotonEliminarCargando?: boolean;
  mostrarBotonGuardarCargando?: boolean;
  mostrarBotonGuardarYCerrarCargando?: boolean;

  alClicEnNuevo?: () => void;
  alClicEnVolver?: () => void;
  alClicEnEliminar?: () => void;
  alClicEnGuardar?: () => void;
  alClicEnGuardarYCerrar?: () => void;
}
export const HerramientasDeDetalle: React.FC<IHerramientasDeDetalleProps> = ({
  textoBotonNuevo = 'Nuevo',

  mostrarBotonNuevo = true,
  mostrarBotonVolver = true,
  mostrarBotonEliminar = true,
  mostrarBotonGuardar = true,
  mostrarBotonGuardarYCerrar = false,

  mostrarBotonNuevoCargando = false,
  mostrarBotonVolverCargando = false,
  mostrarBotonEliminarCargando = false,
  mostrarBotonGuardarCargando = false,
  mostrarBotonGuardarYCerrarCargando = false,

  alClicEnNuevo,
  alClicEnVolver,
  alClicEnEliminar,
  alClicEnGuardar,
  alClicEnGuardarYCerrar,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
      {(mostrarBotonGuardar && !mostrarBotonGuardarCargando) && (
        <Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={alClicEnGuardar}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Guardar
          </Typography>
        </Button>
      )}

      {mostrarBotonGuardarCargando && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotonGuardarYCerrar && !mostrarBotonGuardarYCerrarCargando && !smDown && !mdDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={alClicEnGuardarYCerrar}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Guardar y cerrar
          </Typography>
        </Button>
      )}

      {(mostrarBotonGuardarYCerrarCargando && !smDown && !mdDown) && (
        <Skeleton width={180} height={60} />
      )}

      {(mostrarBotonEliminar && !mostrarBotonEliminarCargando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={alClicEnEliminar}
          startIcon={<Icon>delete</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Eliminar
          </Typography>
        </Button>
      )}

      {mostrarBotonEliminarCargando && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotonNuevo && !mostrarBotonNuevoCargando && !smDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={alClicEnNuevo}
          startIcon={<Icon>add</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            {textoBotonNuevo}
          </Typography>
        </Button>
      )}

      {(mostrarBotonNuevoCargando && !smDown) && (
        <Skeleton width={110} height={60} />
      )}

      {
        (
          mostrarBotonVolver &&
          (mostrarBotonNuevo || mostrarBotonEliminar || mostrarBotonGuardar || mostrarBotonGuardarYCerrar)
        ) && (
          <Divider variant='middle' orientation='vertical' />
        )
      }

      {(mostrarBotonVolver && !mostrarBotonVolverCargando) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={alClicEnVolver}
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Volver
          </Typography>
        </Button>
      )}

      {mostrarBotonVolverCargando && (
        <Skeleton width={110} height={60} />
      )}
    </Box >
  );
};