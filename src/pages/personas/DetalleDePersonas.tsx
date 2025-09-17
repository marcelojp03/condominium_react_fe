import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
// import { AutoCompleteCidade } from './components/AutoCompleteCidade'; // Legacy - not used
import { HerramientasDeDetalle } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

// interface IFormData {
//   email: string;
//   cidadeId: number;
//   nomeCompleto: string;
// } // Legacy - commented out
// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   cidadeId: yup.number().required(),
//   email: yup.string().required().email(),
//   nomeCompleto: yup.string().required().min(3),
// }); // Legacy - commented out

export const DetalleDePersonas: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'nueva' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading] = useState(false); // Removed setIsLoading since it's not used
  const [nombre] = useState(''); // Removed setNombre since form is disabled

  // All form logic commented out for legacy compatibility
  const manejarEliminar = (id: number) => {
    if (confirm('¿Realmente desea eliminar?')) {
      PessoasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro eliminado con éxito!');
            navigate('/personas');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nueva' ? 'Nueva persona' : nombre}
      barraDeHerramientas={
        <HerramientasDeDetalle
          textoBotonNuevo='Nueva'
          mostrarBotonGuardarYCerrar={false}
          mostrarBotonNuevo={id !== 'nueva'}
          mostrarBotonEliminar={id !== 'nueva'}
          // alClicEnGuardar={save} // Legacy - commented out
          // alClicEnGuardarYCerrar={saveAndClose} // Legacy - commented out
          alClicEnVolver={() => navigate('/personas')}
          alClicEnEliminar={() => manejarEliminar(Number(id))}
          alClicEnNuevo={() => navigate('/personas/detalle/nueva')}
        />
      }
    >
      {/* Legacy form - commented out */}
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
        <Grid container direction="column" padding={2} spacing={2}>
          {isLoading && (
            <Grid>
              <LinearProgress variant='indeterminate' />
            </Grid>
          )}
          <Grid>
            <Typography variant='h6'>Esta página usa el sistema de formularios legacy y no está disponible</Typography>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};