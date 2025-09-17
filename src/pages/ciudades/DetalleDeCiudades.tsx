import { useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import * as yup from 'yup'; // Legacy - component not in active routes

import { CidadesService } from '../../shared/services/api/cidades/CidadesService';
// import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'; // Legacy - removed
import { HerramientasDeDetalle } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


// interface IFormData {
//   nome: string;
// } // Legacy - commented out
// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   nome: yup.string().required().min(3),
// }); // Legacy - commented out

export const DetalleDeCiudades: React.FC = () => {
  // const { formRef, save, saveAndClose, isSaveAndClose } = useVForm(); // Legacy - commented out
  const { id = 'nueva' } = useParams<'id'>();
  const navigate = useNavigate();


  const [isLoading] = useState(false);
  const [nombre] = useState(''); // Removed setNombre since it's not used

  // useEffect(() => {
  //   if (id !== 'nueva') {
  //     setIsLoading(true);
  //     CidadesService.getById(Number(id))
  //       .then((result) => {
  //         setIsLoading(false);
  //         if (result instanceof Error) {
  //           alert(result.message);
  //           navigate('/ciudades');
  //         } else {
  //           setNombre(result.nome);
  //           formRef.current?.setData(result);
  //         }
  //       });
  //   } else {
  //     formRef.current?.setData({
  //       nome: '',
  //     });
  //   }
  // }, [id]); // Legacy - commented out

  // const handleSave = (dados: IFormData) => {
  //   // Legacy form handling - commented out
  // }; // Legacy - commented out

  const manejarEliminar = (id: number) => {
    if (confirm('¿Realmente desea eliminar?')) {
      CidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro eliminado con éxito!');
            navigate('/ciudades');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nueva' ? 'Nueva ciudad' : nombre}
      barraDeHerramientas={
        <HerramientasDeDetalle
          textoBotonNuevo='Nueva'
          mostrarBotonGuardarYCerrar={false}
          mostrarBotonNuevo={id !== 'nueva'}
          mostrarBotonEliminar={id !== 'nueva'}
          // alClicEnGuardar={save} // Legacy - commented out
          // alClicEnGuardarYCerrar={saveAndClose} // Legacy - commented out
          alClicEnVolver={() => navigate('/ciudades')}
          alClicEnEliminar={() => manejarEliminar(Number(id))}
          alClicEnNuevo={() => navigate('/ciudades/detalle/nueva')}
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